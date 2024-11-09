import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

export const beta = false;
export const cooldown = 5;

export const data = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Ban a user from the server")
  .setDescriptionLocalizations({
    ru: "Заблокировать пользователя на сервере",
    uk: "Заблокувати користувача на сервері",
    ja: "サーバーからユーザーをバンする",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setContexts(InteractionContextType.Guild)
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to ban")
      .setRequired(true)
      .setDescriptionLocalizations({
        ru: "Пользователь для блокировки",
        uk: "Користувач для блокування",
        ja: "バンするユーザー",
      })
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Reason for the ban")
      .setDescriptionLocalizations({
        ru: "Причина блокировки",
        uk: "Причина блокування",
        ja: "バンの理由",
      })
  )
  .addIntegerOption((option) =>
    option
      .setName("days")
      .setDescription("Number of days of messages to delete (0-7)")
      .setMinValue(0)
      .setMaxValue(7)
      .setDescriptionLocalizations({
        ru: "Количество дней сообщений для удаления (0-7)",
        uk: "Кількість днів повідомлень для видалення (0-7)",
        ja: "メッセージを削除する日数 (0-7)",
      })
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription("Send DM notification to the banned user")
      .setDescriptionLocalizations({
        ru: "Отправить уведомление в ЛС заблокированному пользователю",
        uk: "Надіслати сповіщення в ЛС заблокованому користувачу",
        ja: "バンされたユーザーにDM通知を送信する",
      })
  )
  .setContexts(InteractionContextType.Guild);

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const targetUser = interaction.options.getUser("user");
  const targetMember = await interaction.guild.members
    .fetch(targetUser.id)
    .catch(() => null);
  const reason =
    interaction.options.getString("reason") ||
    client.getLocale(locale, "no_reason");
  const deleteDays = interaction.options.getInteger("days") ?? 1;
  const sendDM = interaction.options.getBoolean("dm") ?? true;

  // Check if user is bannable
  if (targetMember) {
    if (!targetMember.bannable) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#212226")
        .setDescription(client.getLocale(locale, "cannot_ban_user"));
      return interaction.editReply({ embeds: [errorEmbed] });
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
      if (
        targetMember.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        const errorEmbed = new EmbedBuilder()
          .setColor("#212226")
          .setDescription(client.getLocale(locale, "cannot_ban_higher_role"));
        return interaction.editReply({ embeds: [errorEmbed] });
      }
    }
  }

  // Try to DM the user if enabled
  if (sendDM) {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor("#212226")
        .setTitle(client.getLocale(locale, "banned_dm_title"))
        .setDescription(
          client
            .getLocale(locale, "banned_dm_description")
            .replace("{server}", interaction.guild.name)
            .replace("{reason}", reason)
        )
        .setTimestamp();

      await targetUser.send({ embeds: [dmEmbed] }).catch(() => null);
    } catch (error) {
      console.warn(`Failed to send DM to ${targetUser.tag}:`, error);
    }
  }

  // Execute the ban
  try {
    await interaction.guild.members.ban(targetUser.id, {
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
      reason: `[${reason}] - ${interaction.user.tag} (${interaction.user.id})`,
    });

    // Create ban success embed
    const banEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(
        client
          .getLocale(locale, "ban_success")
          .replace("{user}", targetUser.tag)
          .replace("{reason}", reason)
          .replace("{days}", deleteDays)
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [banEmbed] });
  } catch (error) {
    console.error("Ban execution error:", error);
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "ban_failed"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }
}
