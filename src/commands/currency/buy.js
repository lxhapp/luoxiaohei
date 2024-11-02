import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("buy")
  .setDescription("Buy something")
  .setDescriptionLocalizations({
    ru: "Купить что-то",
    uk: "Купити щось",
    ja: "購入する",
  })
  .addStringOption((option) =>
    option
      .setName("item")
      .setDescription("The item to buy")
      .setDescriptionLocalizations({
        ru: "Предмет, который вы хотите купить",
        uk: "Предмет, який ви хочете купити",
        ja: "購入するアイテム",
      })
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of the item to buy (default: 1)")
      .setDescriptionLocalizations({
        ru: "Количество предметов для покупки (по умолчанию: 1)",
        uk: "Кількість предметів для покупки (за замовчуванням: 1)",
        ja: "購入するアイテムの数量（デフォルト：1）",
      })
      .setMinValue(1)
      .setMaxValue(24)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  await interaction.deferReply();
  const itemName = interaction.options.getString("item").trim();
  let amount = interaction.options.getInteger("amount") || 1;

  // Find the item in the shop
  const { data: item, error: itemError } = await supabase
    .from("currency_shop")
    .select("*")
    .ilike("name", itemName)
    .single();

  if (itemError || !item) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "itemNotFound")
    );
  }

  if (item.disabled) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "itemDisabled")
    );
  }

  // Check current inventory size
  const { data: userItems, error: inventoryError } = await supabase
    .from("user_items")
    .select("amount")
    .eq("user_id", interaction.user.id);

  if (inventoryError) {
    console.error("Error fetching inventory:", inventoryError);
    return interaction.editReply(
      client.getLocale(interaction.locale, "inventoryError")
    );
  }

  const currentInventorySize = userItems.reduce((total, userItem) => total + userItem.amount, 0);

  // Calculate how many items can be bought without exceeding the inventory limit
  const availableSpace = 24 - currentInventorySize;
  if (amount > availableSpace) {
    amount = availableSpace;
  }

  if (amount <= 0) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "inventoryFull")
    );
  }

  // Calculate total cost
  const totalCost = Math.round(item.cost * amount);

  // Attempt to buy the item
  const { error: purchaseError } = await supabase.rpc("buy_item", {
    p_user_id: interaction.user.id,
    p_item_id: item.id,
    p_amount: amount,
    p_cost: totalCost,
  });

  if (purchaseError) {
    console.error("Error during purchase:", purchaseError);
    if (purchaseError.message.includes("Insufficient balance")) {
      return interaction.editReply(
        client.getLocale(interaction.locale, "notEnoughBalance")
      );
    } else if (purchaseError.code === "42P10") {
      // If there's a constraint error, try the purchase again
      const retryPurchase = await supabase.rpc("buy_item", {
        p_user_id: interaction.user.id,
        p_item_id: item.id,
        p_amount: amount,
        p_cost: totalCost,
      });
      
      if (retryPurchase.error) {
        console.error("Retry purchase error:", retryPurchase.error);
        return interaction.editReply(
          client.getLocale(interaction.locale, "purchaseError")
        );
      }
    } else {
      return interaction.editReply(
        client.getLocale(interaction.locale, "purchaseError")
      );
    }
  }

  const successEmbed = new EmbedBuilder()
    .setColor("#212226")
    .setTitle(
      client
        .getLocale(interaction.locale, "itemPurchased")
        .replace("{item}", item.name)
    )
    .setDescription(
      client
        .getLocale(interaction.locale, "itemPurchasedDescription")
        .replace("{amount}", amount)
        .replace("{item}", item.name)
        .replace("{price}", totalCost)
    );

  return interaction.editReply({ embeds: [successEmbed] });
}
