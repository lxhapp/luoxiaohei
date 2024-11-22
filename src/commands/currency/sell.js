import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("sell")
  .setDescription("Sell an item from your inventory")
  .setDescriptionLocalizations({
    ru: "Продать предмет из инвентаря",
    uk: "Продати предмет з інвентаря",
    ja: "インベントリからアイテムを販売する",
  })
  .addStringOption((option) =>
    option
      .setName("item")
      .setDescription("The item to sell")
      .setDescriptionLocalizations({
        ru: "Предмет, который вы хотите продать",
        uk: "Предмет, який ви хочете продати",
        ja: "販売するアイテム",
      })
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of the item to sell (default: 1)")
      .setDescriptionLocalizations({
        ru: "Количество предметов для продажи (по умолчанию: 1)",
        uk: "Кількість предметів для продажу (за замовчуванням: 1)",
        ja: "販売するアイテムの数量（デフォルト：1）",
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
  const itemName = interaction.options.getString("item").trim();
  const amount = interaction.options.getInteger("amount") || 1;

  const { data: userItems, error: userItemError } = await supabase
    .from("user_items")
    .select("*, currency_shop(*)")
    .eq("user_id", interaction.user.id);

  if (userItemError) {
    console.error("Error fetching user items:", userItemError);
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(interaction.locale, "databaseError"));
    return interaction.editReply({ embeds: [embed] });
  }

  const userItem = userItems.find(item => 
    item.currency_shop.name.toLowerCase() === itemName.toLowerCase()
  );

  if (!userItem) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(interaction.locale, "itemNotInInventory"));
    return interaction.editReply({ embeds: [embed] });
  }

  if (userItem.amount < amount) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(interaction.locale, "notEnoughItems"));
    return interaction.editReply({ embeds: [embed] });
  }

  // Calculate sell price
  const originalPrice = userItem.currency_shop.cost;
  const sellPrice = Math.max(1, Math.floor(originalPrice / 2));
  const totalSellPrice = sellPrice * amount;

  // Perform the sale
  const { error: saleError } = await supabase.rpc("sell_item", {
    p_user_id: interaction.user.id,
    p_item_id: userItem.item_id,
    p_amount: amount,
    p_sell_price: totalSellPrice,
  });

  if (saleError) {
    console.error("Error during sale:", saleError);
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(interaction.locale, "saleError"));
    return interaction.editReply({ embeds: [embed] });
  }

  const successEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(client.getLocale(interaction.locale, "itemSold"))
    .setDescription(
      client
        .getLocale(interaction.locale, "itemSoldDescription")
        .replace("{amount}", amount)
        .replace("{item}", userItem.currency_shop.name)
        .replace("{price}", totalSellPrice)
    )
    .addFields(
      { name: client.getLocale(interaction.locale, "itemSold"), value: userItem.currency_shop.name, inline: true },
      { name: client.getLocale(interaction.locale, "soldAmount"), value: `${amount}x`, inline: true },
      { name: client.getLocale(interaction.locale, "soldPrice"), value: `${totalSellPrice}¥`, inline: true }
    );

  return interaction.editReply({ embeds: [successEmbed] });
}
