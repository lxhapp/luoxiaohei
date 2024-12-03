import { supabase } from "./main.js";

const USERS_TABLE = "users";
const CURRENCY_SHOP_TABLE = "currency_shop";
const USER_ITEMS_TABLE = "user_items";

async function addItem(userId: any, itemId: any) {
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

async function getItems(userId: any) {
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

async function ensureDatabaseSchema() {
  try {
    const { data: userColumns, error: userColumnsError } = await supabase.rpc(
      "get_table_columns",
      { table_name: USERS_TABLE }
    );

    if (userColumnsError) throw userColumnsError;

    if (
      !userColumns.find(
        (col: { column_name: string }) => col.column_name === "new_column"
      )
    ) {
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
