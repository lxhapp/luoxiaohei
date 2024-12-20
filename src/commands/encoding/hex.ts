import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("hex")
  .setDescription("Convert text to/from hexadecimal")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст в/из шестнадцатеричного формата",
    uk: "Перетворити текст в/з шістнадцяткового формату",
    ja: "テキストを16進数に/から変換する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Convert text to hexadecimal")
      .setDescriptionLocalizations({
        ru: "Преобразовать текст в шестнадцатеричный формат",
        uk: "Перетворити текст у шістнадцятковий формат",
        ja: "テキストを16進数に変換",
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
      .setDescription("Convert hexadecimal to text")
      .setDescriptionLocalizations({
        ru: "Преобразовать шестнадцатеричный формат в текст",
        uk: "Перетворити шістнадцятковий формат в текст",
        ja: "16進数をテキストに変換",
      })
      .addStringOption((option) =>
        option
          .setName("hex")
          .setDescription("Hexadecimal to convert")
          .setDescriptionLocalizations({
            ru: "Шестнадцатеричный код для преобразования",
            uk: "Шістнадцятковий код для перетворення",
            ja: "変換する16進数",
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

function textToHex(text: string): string {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ");
}

function hexToText(hex: string): string {
  return (
    hex
      .replace(/\s+/g, "")
      .match(/.{1,2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join("") || ""
  );
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString(
    subcommand === "encode" ? "text" : "hex"
  );

  try {
    const resultText =
      subcommand === "encode" ? textToHex(text) : hexToText(text);
    const fileName = `${subcommand}d_hex.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "hex.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "hex.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
