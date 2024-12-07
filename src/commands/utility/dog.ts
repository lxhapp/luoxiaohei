import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";
const url = "https://dog.ceo/api/breeds/image/random";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("dog")
  .setDescription("Generates random dog image")
  .setDescriptionLocalizations({
    ru: "Генерирует случайное изображение собаки",
    uk: "Генерує випадкове зображення собаки",
    ja: "ランダムな犬の画像を生成します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const dogembed = new EmbedBuilder().setColor(client.embedColor);

  try {
    const response = await axios.get(url);
    const body = response.data;

    if (typeof body === "object" && body.message) {
      dogembed
        .setImage(body.message)
        .setTitle(client.getLocale(locale, `dog.title`))
        .setTimestamp()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        });
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error("Error in dog command:", error);
    dogembed.setDescription(client.getLocale(locale, `dog.errors.fail`));
  }

  return interaction.editReply({
    embeds: [dogembed],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
