import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 11;
export const data = new SlashCommandBuilder()
  .setName("inventory")
  .setDescription("Check their inventory (or your own)")
  .setDescriptionLocalizations({
    ru: "Проверьте инвентарь (или своего)",
    uk: "Перевірте інвентарь (або свого)",
    ja: "インベントリを確認する（または自分の）",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to check the inventory of")
      .setDescriptionLocalizations({
        ru: "Пользователь, инвентарь которого вы хотите проверить",
        uk: "Користувач, інвентарь якого ви хочете перевірити",
        ja: "インベントリを確認する（または自分の）",
      })
      .setRequired(false)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  const targetUser = interaction.options.getUser("user") || interaction.user;

  // Fetch inventory items
  const { data: items, error } = await supabase
    .from('user_items')
    .select(`
      amount,
      currency_shop(
        id,
        name,
        cost
      )
    `)
    .eq('user_id', targetUser.id)
    .gt('amount', 0)
    .order('amount', { ascending: false });

  if (error) {
    console.error('Error fetching inventory:', error);
    return interaction.editReply(client.getLocale(interaction.locale, "inventoryError"));
  }

  if (!items || items.length === 0) {
    return interaction.editReply(client.getLocale(interaction.locale, "inventoryEmpty"));
  }

  // Create embed
  const embed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(
      client.getLocale(interaction.locale, "inventoryTitle")
        .replace("{user}", targetUser.username)
    )
    .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));

  // Add items to embed
  let totalItems = 0;
  items.forEach(item => {
    if (item.currency_shop && item.amount > 0) {
      const amount = parseInt(item.amount);
      embed.addFields({
        name: item.currency_shop.name,
        value: `x${amount}`,
        inline: true
      });
      totalItems += amount;
    }
  });

  // Add inventory size info
  const maxSlots = 24;
  const availableSlots = maxSlots - totalItems;
  const sizeText = availableSlots === 0
    ? `${totalItems}/${maxSlots} (${client.getLocale(interaction.locale, "inventoryFull")})`
    : `${totalItems}/${maxSlots} (${client.getLocale(interaction.locale, "slotsAvailable").replace("{slots}", availableSlots)})`;

  embed.addFields({
    name: client.getLocale(interaction.locale, "inventorySize"),
    value: sizeText,
    inline: false
  });

  return interaction.editReply({ embeds: [embed] });
} 