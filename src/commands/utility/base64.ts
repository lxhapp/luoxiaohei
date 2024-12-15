import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";

const ADMIN_KEY = "iH1UHPxckWSWvx6p070i7b3iYEr2kZcjAY6IpN1bYqc=";
const BASE_URL = "https://devmatei.is-a.dev/api/base64";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("base64")
  .setDescription("Encode or decode text using base64")
  .setDescriptionLocalizations({
    ru: "Закодировать или декодировать текст с помощью base64",
    uk: "Закодувати або декодувати текст за допомогою base64",
    ja: "base64を使用してテキストをエンコードまたはデコードする",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Encode text to base64")
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to encode")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Decode base64 to text")
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to decode")
          .setRequired(true)
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

async function processBase64(action: string, text: string) {
  try {
    const decodedText = decodeURIComponent(text);
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        action,
        text: decodedText,
      },
      headers: {
        "X-API-Key": ADMIN_KEY,
      },
    });

    if (action === "decode") {
      response.data.decoded = decodeURIComponent(response.data.decoded);
    }

    return response.data;
  } catch (error) {
    console.error(`Base64 ${action} error:`, error);
    return null;
  }
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");

  const result = await processBase64(subcommand, text);

  if (!result) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle("Base64")
      .setDescription(client.getLocale(locale, "base64.error"))
      .setTimestamp();

    return interaction.editReply({ embeds: [errorEmbed] });
  }

  const resultText = subcommand === "encode" ? result.encoded : result.decoded;
  const fileName = `${subcommand}d_text.txt`;

  const resultEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle("Base64")
    .addFields({ name: client.getLocale(locale, "base64.input"), value: text })
    .setTimestamp();

  const textFile = Buffer.from(resultText);

  await interaction.editReply({
    embeds: [resultEmbed],
    files: [
      {
        attachment: textFile,
        name: fileName,
      },
    ],
  });
}
