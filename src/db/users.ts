import { supabase } from "./main.js";

const USERS_TABLE = "users";

async function upsertUser(userId: any, balance = 0) {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .upsert({ user_id: userId, balance }, { onConflict: "user_id" });

  if (error) throw error;
  return data;
}

async function getUser(userId: any) {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

async function updateBalance(userId: any, amount: any) {
  const { data: currentUser, error: findError } = await supabase
    .from(USERS_TABLE)
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (findError) throw findError;

  const { data, error } = await supabase
    .from(USERS_TABLE)
    .update({ balance: (currentUser.balance || 0) + amount })
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return data;
}

export { upsertUser, getUser, updateBalance };
