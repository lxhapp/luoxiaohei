import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

export const beta = false;
export const cooldown = 5;

export const data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout a user in the server")
  .setDescriptionLocalizations({
    ru: "Временно ограничить пользователя",
    uk: "Тимчасово обмежити користувача",
    ja: "サーバーでユーザーをタイムアウトする",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .setContexts(InteractionContextType.Guild)
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to timeout")
      .setRequired(true)
      .setDescriptionLocalizations({
        ru: "Пользователь для ограничения",
        uk: "Користувач для обмеження",
        ja: "タイムアウトするユーザー",
      })
  )
  .addStringOption((option) =>
    option
      .setName("duration")
      .setDescription("Timeout duration (1m, 1h, 1d)")
      .setRequired(true)
      .setDescriptionLocalizations({
        ru: "Длительность ограничения (1m, 1h, 1d)",
        uk: "Тривалість обмеження (1m, 1h, 1d)",
        ja: "タイムアウト期間 (1m, 1h, 1d)",
      })
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Reason for the timeout")
      .setDescriptionLocalizations({
        ru: "Причина ограничения",
        uk: "Причина обмеження",
        ja: "タイムアウトの理由",
      })
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription("Send DM notification to the timed out user")
      .setDescriptionLocalizations({
        ru: "Отправить уведомление в ЛС ограниченному пользователю",
        uk: "Надіслати сповіщення в ЛС обмеженому користувачу",
        ja: "タイムアウトされたユーザーにDM通知を送信する",
      })
  );

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const targetUser = interaction.options.getUser("user");
  const targetMember = await interaction.guild.members
    .fetch(targetUser.id)
    .catch(() => null);
  const reason =
    interaction.options.getString("reason") ||
    client.getLocale(locale, "no_reason");
  const sendDM = interaction.options.getBoolean("dm") ?? true;
  const duration = interaction.options.getString("duration");

  // Parse duration
  const durationMs = parseDuration(duration);
  if (!durationMs) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "invalid_duration_format"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  // Check if duration is within limits (max 28 days)
  if (durationMs > 2419200000) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "duration_too_long"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  // Check if user exists in the server
  if (!targetMember) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "user_not_in_server"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  // Check if user can be timed out
  if (!targetMember.moderatable) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "cannot_timeout_user"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  // Check role hierarchy
  if (interaction.guild.ownerId !== interaction.user.id) {
    if (
      targetMember.roles.highest.position >=
      interaction.member.roles.highest.position
    ) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#212226")
        .setDescription(client.getLocale(locale, "cannot_timeout_higher_role"));
      return interaction.editReply({ embeds: [errorEmbed] });
    }
  }

  // Try to DM the user if enabled
  if (sendDM) {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor("#212226")
        .setTitle(client.getLocale(locale, "timeout_dm_title"))
        .setDescription(
          client
            .getLocale(locale, "timeout_dm_description")
            .replace("{server}", interaction.guild.name)
            .replace("{duration}", formatDuration(durationMs))
            .replace("{reason}", reason)
        )
        .setTimestamp();

      await targetUser.send({ embeds: [dmEmbed] }).catch(() => null);
    } catch (error) {
      console.warn(`Failed to send DM to ${targetUser.tag}:`, error);
    }
  }

  // Execute the timeout
  try {
    await targetMember.timeout(
      durationMs,
      `[${reason}] - ${interaction.user.tag} (${interaction.user.id})`
    );

    // Create timeout success embed
    const timeoutEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(
        client
          .getLocale(locale, "timeout_success")
          .replace("{user}", targetUser.tag)
          .replace("{duration}", formatDuration(durationMs))
          .replace("{reason}", reason)
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [timeoutEmbed] });
  } catch (error) {
    console.error("Timeout execution error:", error);
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "timeout_failed"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }
}

function parseDuration(duration) {
  const regex = /^(\d+)([mhd])$/;
  const match = duration.toLowerCase().match(regex);
  if (!match) return null;

  const [, amount, unit] = match;
  const value = parseInt(amount);

  switch (unit) {
    case "m":
      return value * 60 * 1000; // minutes
    case "h":
      return value * 60 * 60 * 1000; // hours
    case "d":
      return value * 24 * 60 * 60 * 1000; // days
    default:
      return null;
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
