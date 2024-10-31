import { supabase } from "./main.js";

const CURRENCY_SHOP_TABLE = 'currency_shop';

async function initializeShop() {
  const shopItems = [
    { name: "Luo Toy", cost: 7 },
    { name: "Useless Luck", cost: 9 },
    { name: "Hryvnia", cost: 4 },
    { name: "Blueberry", cost: 2 },
  ];

  for (const item of shopItems) {
    const { data, error } = await supabase
      .from(CURRENCY_SHOP_TABLE)
      .upsert(item, { onConflict: 'name' })
      .select();

    if (error) {
      console.error(`Error upserting ${item.name}:`, error);
    } else {
      console.log(`Upserted ${item.name}`);
    }
  }
}

async function main() {
  try {
    await initializeShop();
    console.log("Shop initialized successfully");
  } catch (error) {
    console.error("Error initializing shop:", error);
  }
}

main();
