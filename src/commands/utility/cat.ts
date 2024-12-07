import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";
const url = "https://api.thecatapi.com/v1/images/search";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("cat")
  .setDescription("Generates random cat image")
  .setDescriptionLocalizations({
    ru: "Генерирует случайное изображение кошки",
    uk: "Генерує випадкове зображення кота",
    ja: "ランダムな猫の画像を生成します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const catembed = new EmbedBuilder().setColor(client.embedColor);

  try {
    const response = await axios.get(url);
    const body = response.data;

    if (Array.isArray(body)) {
      const catObject = body[0];
      catembed
        .setImage(catObject.url)
        .setTitle(client.getLocale(locale, `cat.title`))
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error in cat command:", error);
    catembed.setDescription(client.getLocale(locale, `cat.errors.fail`));
  }

  return interaction.editReply({
    embeds: [catembed],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
