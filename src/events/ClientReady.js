import { Events } from "discord.js";
import { supabase } from "../db/main.js";

export const name = Events.ClientReady;
export const once = true;
export async function execute(client) {
  console.log(`Logged in as ${client.user.tag}`)
  try {
    // Check if the users table exists
    const { data, error } = await supabase
      .from("users")
      .select("user_id, balance")
      .limit(1);

    if (error) {
      if (error.code === "42P01") {
        console.error(
          "The 'users' table does not exist. Please create it manually using the following SQL:"
        );
        console.error(`
CREATE TABLE public.users (
  user_id TEXT PRIMARY KEY,
  balance INTEGER DEFAULT 0
);
        `);
        console.error("After creating the table, restart the bot.");
        process.exit(1);
      } else {
        throw error;
      }
    }

    console.log("Supabase connection successful");

    // Fetch all user balances
    const { data: storedBalances, error: balancesError } = await supabase
      .from("users")
      .select("user_id, balance");

    if (balancesError) throw balancesError;

    // Populate the client's currency cache
    storedBalances.forEach((b) => client.currency.set(b.user_id, b));
  } catch (error) {
    console.error(error);
    if (error.code === "28P01") {
      console.error(
        "Authentication failed. Please check your Supabase credentials."
      );
    } else if (error.code === "42501") {
      console.error(
        "Permission denied. Please check the permissions for your Supabase connection."
      );
    } else {
      console.error(
        "An unexpected error occurred. Please check your Supabase configuration and schema"
      );
    }
    process.exit(1);
  }
}
