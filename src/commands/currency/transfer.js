import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("transfer")
  .setDescription("Transfer your balance to another user")
  .setDescriptionLocalizations({
    ru: "Переведите ваш баланс другому пользователю",
    uk: "Переведіть ваш баланс користувачу",
    ja: "バランスを転送するユーザー",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to transfer the balance to")
      .setDescriptionLocalizations({
        ru: "Пользователь, которому вы хотите перевести баланс",
        uk: "Користувач, котрому ви хочете перевести баланс",
        ja: "バランスを転送するユーザー",
      })
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of balance to transfer")
      .setDescriptionLocalizations({
        ru: "Количество баланса, которое вы хотите перевести",
        uk: "Кількість балансу, яку ви хочете перевести",
        ja: "転送するバランスの量",
      })
      .setMinValue(1)
      .setMaxValue(32768)
      .setRequired(true)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  await interaction.deferReply();

  const transferAmount = interaction.options.getInteger("amount");
  const transferTarget = interaction.options.getUser("user");

  if (transferTarget.bot) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "transferBot")
    );
  }

  if (transferTarget.id === interaction.user.id) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "transferSameUser")
    );
  }

  // Check sender's balance
  const { data: sender, error: senderError } = await supabase
    .from('users')
    .select('balance')
    .eq('user_id', interaction.user.id)
    .single();

  if (senderError) {
    console.error('Error fetching sender balance:', senderError);
    return interaction.editReply(client.getLocale(interaction.locale, "transferError"));
  }

  if (!sender || transferAmount > sender.balance) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "transferInsufficientBalance")
    );
  }

  const embed = new EmbedBuilder()
    .setColor("#212226")
    .setTitle(client.getLocale(interaction.locale, "transferConfirmTitle"))
    .setDescription(
      client
        .getLocale(interaction.locale, "transferConfirmDescription")
        .replace("{amount}", transferAmount)
        .replace("{user}", transferTarget.toString())
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("transfer_confirm")
      .setLabel(client.getLocale(interaction.locale, "yes"))
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("transfer_cancel")
      .setLabel(client.getLocale(interaction.locale, "no"))
      .setStyle(ButtonStyle.Danger)
  );

  const response = await interaction.editReply({
    embeds: [embed],
    components: [row],
  });

  const filter = (i) => i.user.id === interaction.user.id;
  try {
    const confirmation = await response.awaitMessageComponent({
      filter,
      time: 60000,
    });

    if (confirmation.customId === "transfer_confirm") {
      // Perform the transfer
      const { data, error } = await supabase.rpc('transfer_balance', {
        from_user_id: interaction.user.id,
        to_user_id: transferTarget.id,
        amount: transferAmount
      });

      if (error) {
        console.error("Transfer error:", error);
        return interaction.editReply(client.getLocale(interaction.locale, "transferError"));
      }

      const successEmbed = new EmbedBuilder()
        .setColor("#212226")
        .setDescription(
          client
            .getLocale(interaction.locale, "transferSuccess")
            .replace("{amount}", transferAmount)
            .replace("{user}", transferTarget.toString())
        );

      await confirmation.update({ embeds: [successEmbed], components: [] });
    } else if (confirmation.customId === "transfer_cancel") {
      const cancelEmbed = new EmbedBuilder()
        .setColor("#212226")
        .setDescription(
          client.getLocale(interaction.locale, "transferCancelled")
        );

      await confirmation.update({ embeds: [cancelEmbed], components: [] });
    }
  } catch (error) {
    console.error("Transfer error:", error);
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(interaction.locale, "interr"));

    await interaction.editReply({ embeds: [errorEmbed], components: [] });
  }
}
