import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("caesar")
  .setDescription("Encode or decode text using Caesar cipher")
  .setDescriptionLocalizations({
    ru: "Зашифровать или расшифровать текст шифром Цезаря",
    uk: "Зашифрувати або розшифрувати текст шифром Цезаря",
    ja: "シーザー暗号でテキストを暗号化/復号化する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Encode text using Caesar cipher")
      .setDescriptionLocalizations({
        ru: "Зашифровать текст шифром Цезаря",
        uk: "Зашифрувати текст шифром Цезаря",
        ja: "シーザー暗号でテキストを暗号化",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to encode")
          .setDescriptionLocalizations({
            ru: "Текст для шифрования",
            uk: "Текст для шифрування",
            ja: "暗号化するテキスト",
          })
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("shift")
          .setDescription("Number of positions to shift (1-25)")
          .setDescriptionLocalizations({
            ru: "Количество позиций сдвига (1-25)",
            uk: "Кількість позицій зсуву (1-25)",
            ja: "シフトする位置の数 (1-25)",
          })
          .setMinValue(1)
          .setMaxValue(25)
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Decode text using Caesar cipher")
      .setDescriptionLocalizations({
        ru: "Расшифровать текст шифром Цезаря",
        uk: "Розшифрувати текст шифром Цезаря",
        ja: "シーザー暗号でテキストを復号化",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to decode")
          .setDescriptionLocalizations({
            ru: "Текст для расшифровки",
            uk: "Текст для розшифрування",
            ja: "復号化するテキスト",
          })
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("shift")
          .setDescription("Number of positions to shift back (1-25)")
          .setDescriptionLocalizations({
            ru: "Количество позиций обратного сдвига (1-25)",
            uk: "Кількість позицій зворотного зсуву (1-25)",
            ja: "シフトバックする位置の数 (1-25)",
          })
          .setMinValue(1)
          .setMaxValue(25)
          .setRequired(true)
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function caesar(text: string, shift: number, encode: boolean): string {
  const actualShift = encode ? shift : 26 - shift;
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90)
        // Uppercase
        return String.fromCharCode(((code - 65 + actualShift) % 26) + 65);
      if (code >= 97 && code <= 122)
        // Lowercase
        return String.fromCharCode(((code - 97 + actualShift) % 26) + 97);
      return char;
    })
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");
  const shift = interaction.options.getInteger("shift");

  try {
    const resultText = caesar(text, shift, subcommand === "encode");
    const fileName = `${subcommand}d_caesar.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields(
        { name: client.getLocale(locale, "caesar.input"), value: text },
        {
          name: client.getLocale(locale, "caesar.shift"),
          value: shift.toString(),
        }
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "caesar.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
