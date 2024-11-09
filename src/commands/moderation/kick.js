import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

export const beta = false;
export const cooldown = 5;

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a user from the server")
  .setDescriptionLocalizations({
    ru: "Выгнать пользователя с сервера",
    uk: "Вигнати користувача з сервера",
    ja: "サーバーからユーザーをキックする",
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .setContexts(InteractionContextType.Guild)
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to kick")
      .setRequired(true)
      .setDescriptionLocalizations({
        ru: "Пользователь для исключения",
        uk: "Користувач для виключення",
        ja: "キックするユーザー",
      })
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Reason for the kick")
      .setDescriptionLocalizations({
        ru: "Причина исключения",
        uk: "Причина виключення",
        ja: "キックの理由",
      })
  )
  .addBooleanOption((option) =>
    option
      .setName("dm")
      .setDescription("Send DM notification to the kicked user")
      .setDescriptionLocalizations({
        ru: "Отправить уведомление в ЛС исключенному пользователю",
        uk: "Надіслати сповіщення в ЛС виключеному користувачу",
        ja: "キックされたユーザーにDM通知を送信する",
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
  const sendDM = interaction.options.getBoolean("dm") ?? true;

  // Check if user exists in the server
  if (!targetMember) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "user_not_in_server"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }

  // Check if user is kickable
  if (!targetMember.kickable) {
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "cannot_kick_user"));
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
        .setDescription(client.getLocale(locale, "cannot_kick_higher_role"));
      return interaction.editReply({ embeds: [errorEmbed] });
    }
  }

  // Try to DM the user if enabled
  if (sendDM) {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor("#212220")
        .setTitle(client.getLocale(locale, "kicked_dm_title"))
        .setDescription(
          client
            .getLocale(locale, "kicked_dm_description")
            .replace("{server}", interaction.guild.name)
            .replace("{reason}", reason)
        )
        .setTimestamp();

      await targetUser.send({ embeds: [dmEmbed] }).catch(() => null);
    } catch (error) {
      console.warn(`Failed to send DM to ${targetUser.tag}:`, error);
    }
  }

  // Execute the kick
  try {
    await targetMember.kick(
      `[${reason}] - ${interaction.user.tag} (${interaction.user.id})`
    );

    // Create kick success embed
    const kickEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(
        client
          .getLocale(locale, "kick_success")
          .replace("{user}", targetUser.tag)
          .replace("{reason}", reason)
      )
      .setTimestamp();

    return interaction.editReply({ embeds: [kickEmbed] });
  } catch (error) {
    console.error("Kick execution error:", error);
    const errorEmbed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "kick_failed"));
    return interaction.editReply({ embeds: [errorEmbed] });
  }
}
