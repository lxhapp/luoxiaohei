import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 10;
export const data = new SlashCommandBuilder()
  .setName("luoinfo")
  .setDescription("Shows information about the user as Luo Xiaohei")
  .setDescriptionLocalizations({
    ru: "Показывает информацию о пользователе как Ло Сяохэй",
    uk: "Показує інформацію про користувача як Ло Сяохей",
    ja: "ロシャオヘイの情報を表示する",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("User value is required to get info as Luo Xiaohei")
      .setDescriptionLocalizations({
        ru: "Для получения информации требуется значение пользователя как Ло Сяохэй",
        uk: "Для отримання інформації необхідне значення користувача як Ло Сяохей",
        ja: "ロシャオヘイの情報を表示するためにはユーザーの値が必要です",
      })
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  const { locale } = interaction;

  const user = interaction.options.getUser("user") || interaction.user;

  if (!user) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "userNotFound"));

    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user data:", error);
    return interaction.editReply({
      content: client.getLocale(locale, "databaseError"),
      ephemeral: true,
    });
  }

  const isRegistered = userData ? true : false;
  const isVerified = userData?.verified || false;
  const balance = userData?.balance || 0;

  const userinfoEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(
      `${user.tag} ${isVerified ? "<:verified:1298973121839235143>" : ""}`
    )
    .setThumbnail(user.displayAvatarURL())
    .addFields(
      {
        name: "ID",
        value: user.id,
        inline: true,
      },
      {
        name: client.getLocale(locale, "isRegistered"),
        value: isRegistered
          ? "<:check:1281579844089675810>"
          : "<:cross:1281580669373382686>",
        inline: true,
      }
    );

  if (isRegistered) {
    userinfoEmbed.addFields({
      name: client.getLocale(locale, "balance"),
      value: `**${balance}¥**`,
      inline: true,
    });
  }

  await interaction.editReply({
    embeds: [userinfoEmbed],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
