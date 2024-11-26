import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Gets the user profile image")
  .setDescriptionLocalizations({
    ru: "Получает изображение профиля пользователя",
    uk: "Отримує зображення профілю користувача",
    ja: "ユーザーのプロフィール画像を取得する",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("User value is required to get info")
      .setDescriptionLocalizations({
        ru: "Для получения изображения профиля требуется значение пользователя",
        uk: "Для отримання ізображення профілю необхідне значення користувача",
        ja: "ユーザーのプロフィール画像を取得するためにはユーザーの値が必要です",
      })
      .setRequired(false)
  )
  .setContexts(InteractionContextType.Guild);
export async function run({ interaction, client }) {
  const user = interaction.options.getUser("user") || interaction.user;

  if (!user) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "profile.userNotFound"));

    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  await interaction.editReply({
    files: [{ attachment: user.displayAvatarURL(), name: `${user.tag}.png` }],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
