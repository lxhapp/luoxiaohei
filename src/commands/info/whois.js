import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 10;
export const data = new SlashCommandBuilder()
  .setName("whois")
  .setDescription("Who are you, User?")
  .setDescriptionLocalizations({
    ru: "Кто ты, пользователь?",
    uk: "Хто ти, користувач?",
    ja: "あなたは誰ですか？",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("User value is required to get info")
      .setDescriptionLocalizations({
        ru: "Для получения информации требуется значение пользователя",
        uk: "Для отримання інформації необхідне значення користувача",
        ja: "ユーザーの情報を取得するためにはユーザーの値が必要です",
      })
      .setRequired(true)
  )
  .setContexts(InteractionContextType.Guild);
export async function run({ interaction, client }) {
  const { locale } = interaction;

  const user = interaction.options.getUser("user") || interaction.user;

  if (!user) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "userNotFound"));

    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  const member = await interaction.guild.members.fetch(user.id);
  const icon = user.displayAvatarURL();

  const userinfoEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setAuthor({
      name: user.tag,
      iconURL: icon,
    })
    .setThumbnail(icon)
    .addFields({
      name: client.getLocale(locale, `member`),
      value: `${user}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `roles`),
      value: `${member.roles.cache.map((r) => r).join(` `)}`,
      inline: false,
    })
    .addFields({
      name: client.getLocale(locale, `joinedAt`),
      value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `createdAt`),
      value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
      inline: true,
    })
    .addFields({
      name: "ID",
      value: `${user.id}`,
      inline: true,
    })
    .setTimestamp();

  await interaction.editReply({
    embeds: [userinfoEmbed],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
