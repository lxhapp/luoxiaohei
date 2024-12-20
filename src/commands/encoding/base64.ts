import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

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
      .setDescriptionLocalizations({
        ru: "Закодировать текст в base64",
        uk: "Закодувати текст у base64",
        ja: "テキストをbase64にエンコードする",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to encode")
          .setDescriptionLocalizations({
            ru: "Текст для кодирования",
            uk: "Текст для кодування",
            ja: "エンコードするテキスト",
          })
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Decode base64 to text")
      .setDescriptionLocalizations({
        ru: "Декодировать base64 в текст",
        uk: "Декодувати base64 у текст",
        ja: "base64をテキストにデコードする",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to decode")
          .setDescriptionLocalizations({
            ru: "Текст для декодирования",
            uk: "Текст для декодування",
            ja: "デコードするテキスト",
          })
          .setRequired(true)
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function encodeBase64(text: string): string {
  return Buffer.from(text).toString("base64");
}

function decodeBase64(text: string): string {
  return Buffer.from(text, "base64").toString("utf-8");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");

  try {
    const resultText =
      subcommand === "encode" ? encodeBase64(text) : decodeBase64(text);

    const fileName = `${subcommand}d_text.txt`;
    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle("Base64")
      .addFields({
        name: client.getLocale(locale, "base64.input"),
        value: text,
      })
      .setTimestamp();

    const textFile = Buffer.from(resultText);

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: textFile, name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle("Base64")
      .setDescription(client.getLocale(locale, "base64.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
