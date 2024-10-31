import { supabase } from './main.js';

const CURRENCY_SHOP_TABLE = 'currency_shop';

// Function to add an item to the currency shop
async function addShopItem(name, cost) {
  const { data, error } = await supabase
    .from(CURRENCY_SHOP_TABLE)
    .insert({ name, cost });

  if (error) throw error;
  return data;
}

// Function to get all items from the currency shop
async function getAllShopItems() {
  const { data, error } = await supabase
    .from(CURRENCY_SHOP_TABLE)
    .select('*');

  if (error) throw error;
  return data;
}

// Function to get a specific item from the currency shop
async function getShopItem(name) {
  const { data, error } = await supabase
    .from(CURRENCY_SHOP_TABLE)
    .select('*')
    .eq('name', name)
    .single();

  if (error) throw error;
  return data;
}

export { addShopItem, getAllShopItems, getShopItem };
