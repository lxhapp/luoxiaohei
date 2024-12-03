import { supabase } from "./main.js";

const CURRENCY_SHOP_TABLE = "currency_shop";

async function addShopItem(name: any, cost: any) {
  const { data, error } = await supabase
    .from(CURRENCY_SHOP_TABLE)
    .insert({ name, cost });

  if (error) throw error;
  return data;
}

async function getAllShopItems() {
  const { data, error } = await supabase.from(CURRENCY_SHOP_TABLE).select("*");

  if (error) throw error;
  return data;
}

async function getShopItem(name: any) {
  const { data, error } = await supabase
    .from(CURRENCY_SHOP_TABLE)
    .select("*")
    .eq("name", name)
    .single();

  if (error) throw error;
  return data;
}

export { addShopItem, getAllShopItems, getShopItem };
