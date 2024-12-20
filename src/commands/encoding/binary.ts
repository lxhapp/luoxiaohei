import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("binary")
  .setDescription("Convert text to/from binary")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст в/из двоичного кода",
    uk: "Перетворити текст в/з двійкового коду",
    ja: "テキストをバイナリに/からに変換する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Convert text to binary")
      .setDescriptionLocalizations({
        ru: "Преобразовать текст в двоичный код",
        uk: "Перетворити текст у двійковий код",
        ja: "テキストをバイナリに変換",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to convert")
          .setDescriptionLocalizations({
            ru: "Текст для преобразования",
            uk: "Текст для перетворення",
            ja: "変換するテキスト",
          })
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Convert binary to text")
      .setDescriptionLocalizations({
        ru: "Преобразовать двоичный код в текст",
        uk: "Перетворити двійковий код в текст",
        ja: "バイナリをテキストに変換",
      })
      .addStringOption((option) =>
        option
          .setName("binary")
          .setDescription("Binary to convert")
          .setDescriptionLocalizations({
            ru: "Двоичный код для преобразования",
            uk: "Двійковий код для перетворення",
            ja: "変換するバイナリ",
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

function textToBinary(text: string): string {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(binary: string): string {
  return binary
    .split(" ")
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString(
    subcommand === "encode" ? "text" : "binary"
  );

  try {
    const resultText =
      subcommand === "encode" ? textToBinary(text) : binaryToText(text);
    const fileName = `${subcommand}d_binary.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({
        name: client.getLocale(locale, "binary.input"),
        value: text,
      })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "binary.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
