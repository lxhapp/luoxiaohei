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
  const reason =
    interaction.options.getString("reason") ||
    client.getLocale(locale, "ban.fields.noReason");
  const deleteDays = interaction.options.getInteger("days") ?? 1;
  const sendDM = interaction.options.getBoolean("dm") ?? true;

  if (!interaction.guild) {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "ban.errors.guildOnly")),
      ],
    });
  }

  if (targetUser.id === interaction.user.id) {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "ban.errors.cannotBanSelf")),
      ],
    });
  }

  if (targetUser.id === client.user.id) {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "ban.errors.cannotBanBot")),
      ],
    });
  }

  const targetMember = await interaction.guild.members
    .fetch(targetUser.id)
    .catch(() => null);

  if (targetMember) {
    if (!targetMember.bannable) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.embedColor)
            .setDescription(client.getLocale(locale, "ban.errors.cannotBanUser")),
        ],
      });
    }

    if (interaction.guild.ownerId !== interaction.user.id) {
      if (
        targetMember.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                client.getLocale(locale, "ban.errors.higherRole")
              ),
          ],
        });
      }
    }
  }

  if (sendDM && !targetUser.bot) {
    try {
      const dmEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({
          name: client.getLocale(locale, "ban.dm.title"),
          iconURL: interaction.guild.iconURL({ dynamic: true }) || null,
        })
        .addFields([
          {
            name: client.getLocale(locale, "ban.fields.server"),
            value: interaction.guild.name,
            inline: true,
          },
          {
            name: client.getLocale(locale, "ban.fields.moderator"),
            value: interaction.user.tag,
            inline: true,
          },
          {
            name: client.getLocale(locale, "ban.fields.reason"),
            value: reason,
            inline: false,
          },
        ])
        .setTimestamp();

      await targetUser.send({ embeds: [dmEmbed] }).catch(() => null);
    } catch (error) {
      console.warn(`Failed to send DM to ${targetUser.tag}:`, error);
    }
  }

  // Execute the ban
  try {
    await interaction.guild.bans.create(targetUser.id, {
      reason: reason,
      deleteMessageSeconds: deleteDays * 24 * 60 * 60,
    });

    // Create ban success embed
    const banEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setAuthor({
        name: client.getLocale(locale, "ban.success.title"),
        iconURL: interaction.guild.iconURL({ dynamic: true }) || null,
      })
      .addFields([
        {
          name: client.getLocale(locale, "ban.fields.bannedUser"),
          value: `${targetUser.tag} (${targetUser.id})`,
          inline: true,
        },
        {
          name: client.getLocale(locale, "ban.fields.bannedBy"),
          value: interaction.user.tag,
          inline: true,
        },
        {
          name: client.getLocale(locale, "ban.fields.messageDeletion"),
          value: `${deleteDays} ${client.getLocale(locale, "days")}`,
          inline: true,
        },
        {
          name: client.getLocale(locale, "ban.fields.reason"),
          value: reason,
          inline: false,
        },
      ])
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({
        text: client.getLocale(locale, "ban.footer.moderation"),
        iconURL: client.user.displayAvatarURL(),
      });

    return interaction.editReply({ embeds: [banEmbed] });
  } catch (error) {
    console.error("Ban execution error:", error);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "ban.errors.banFailed")),
      ],
    });
  }
}
