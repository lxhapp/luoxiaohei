import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 28;
export const data = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("View all items in the shop")
  .setDescriptionLocalizations({
    ru: "Просмотр всех предметов в магазине",
    uk: "Перегляд всіх предметів у магазині",
    ja: "店舗内のすべてのアイテムを表示する",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  await interaction.deferReply();

  // Fetch all enabled items from the currency_shop table
  const { data: items, error } = await supabase
    .from('currency_shop')
    .select('*')
    .eq('disabled', false)  // Only select items that are not disabled
    .order('cost', { ascending: true });

  if (error) {
    console.error('Error fetching shop items:', error);
    return interaction.editReply(client.getLocale(interaction.locale, "shopError"));
  }

  if (!items || items.length === 0) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "shopEmpty")
    );
  }

  const embed = new EmbedBuilder()
    .setColor("#212226")
    .setTitle("🛒");

  items.forEach((item) => {
    embed.addFields({
      name: item.name,
      value: `${item.cost}¥`,
      inline: true,
    });
  });

  return interaction.editReply({ embeds: [embed] });
}
