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
  const transferAmount = interaction.options.getInteger("amount");
  const transferTarget = interaction.options.getUser("user");

  const { locale } = interaction;

  if (transferTarget.bot) {
    return interaction.editReply(client.getLocale(locale, "transfer.bot"));
  }

  if (transferTarget.id === interaction.user.id) {
    return interaction.editReply(client.getLocale(locale, "transfer.sameUser"));
  }

  // Check if sender exists, if not create them
  let { data: sender, error: senderError } = await supabase
    .from("users")
    .select("balance")
    .eq("user_id", interaction.user.id)
    .single();

  if (senderError) {
    // If user doesn't exist, create them
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([{ user_id: interaction.user.id, balance: 0 }])
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return interaction.editReply(client.getLocale(locale, "transfer.error"));
    }

    sender = newUser;
  }

  // Check if recipient exists, if not create them
  const { data: recipient, error: recipientError } = await supabase
    .from("users")
    .select("balance")
    .eq("user_id", transferTarget.id)
    .single();

  if (recipientError) {
    // If recipient doesn't exist, create them
    await supabase
      .from("users")
      .insert([{ user_id: transferTarget.id, balance: 0 }]);
  }

  if (transferAmount > sender.balance) {
    return interaction.editReply(
      client.getLocale(locale, "transfer.insufficientBalance")
    );
  }

  const embed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(client.getLocale(locale, "transfer.confirmTitle"))
    .setDescription(
      client
        .getLocale(locale, "transfer.confirmDescription")
        .replace("{amount}", transferAmount)
        .replace("{user}", transferTarget.toString())
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("transfer_confirm")
      .setLabel(client.getLocale(locale, "transfer.yes"))
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("transfer_cancel")
      .setLabel(client.getLocale(locale, "transfer.no"))
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
      const { data, error } = await supabase.rpc("transfer_balance", {
        from_user_id: interaction.user.id,
        to_user_id: transferTarget.id,
        amount: transferAmount,
      });

      if (error) {
        console.error("Transfer error:", error);
        return interaction.editReply(
          client.getLocale(locale, "transfer.error")
        );
      }

      const successEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          client
            .getLocale(locale, "transfer.success")
            .replace("{amount}", transferAmount)
            .replace("{user}", transferTarget.toString())
        );

      await confirmation.update({ embeds: [successEmbed], components: [] });
    } else if (confirmation.customId === "transfer_cancel") {
      const cancelEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(client.getLocale(locale, "transfer.cancelled"));

      await confirmation.update({ embeds: [cancelEmbed], components: [] });
    }
  } catch (error) {
    console.error("Transfer error:", error);
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "InteractionCreate.error"));

    await interaction.editReply({ embeds: [errorEmbed], components: [] });
  }
}
