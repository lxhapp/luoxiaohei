import { supabase } from "./main.js";

// Define table names
const USERS_TABLE = "users";
const CURRENCY_SHOP_TABLE = "currency_shop";
const USER_ITEMS_TABLE = "user_items";

// Helper function to add an item to a user
async function addItem(userId, itemId) {
  const { data: existingItem, error: fetchError } = await supabase
    .from(USER_ITEMS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  if (existingItem) {
    const { data, error } = await supabase
      .from(USER_ITEMS_TABLE)
      .update({ amount: existingItem.amount + 1 })
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from(USER_ITEMS_TABLE)
      .insert({ user_id: userId, item_id: itemId, amount: 1 });

    if (error) throw error;
    return data;
  }
}

// Helper function to get user items
async function getItems(userId) {
  const { data, error } = await supabase
    .from(USER_ITEMS_TABLE)
    .select(
      `
      *,
      item:${CURRENCY_SHOP_TABLE}(*)
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

// Function to ensure database schema
async function ensureDatabaseSchema() {
  try {
    // Check if new_column exists in users table
    const { data: userColumns, error: userColumnsError } = await supabase.rpc(
      "get_table_columns",
      { table_name: USERS_TABLE }
    );

    if (userColumnsError) throw userColumnsError;

    if (!userColumns.find((col) => col.column_name === "new_column")) {
      console.log("Adding new_column to users table");
      const { error: alterError } = await supabase.rpc(
        "add_column_if_not_exists",
        {
          table_name: USERS_TABLE,
          column_name: "new_column",
          column_type: "TEXT",
        }
      );

      if (alterError) throw alterError;
    }

    console.log("Database schema ensured successfully");
  } catch (error) {
    console.error("Error during database schema check:", error);
  }
}

export { addItem, getItems, ensureDatabaseSchema };
