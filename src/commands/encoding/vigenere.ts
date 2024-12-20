import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("vigenere")
  .setDescription("Encode or decode text using Vigenère cipher")
  .setDescriptionLocalizations({
    ru: "Зашифровать или расшифровать текст шифром Виженера",
    uk: "Зашифрувати або розшифрувати текст шифром Віженера",
    ja: "ヴィジュネル暗号でテキストを暗号化/復号化する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Encode text using Vigenère cipher")
      .setDescriptionLocalizations({
        ru: "Зашифровать текст шифром Виженера",
        uk: "Зашифрувати текст шифром Віженера",
        ja: "ヴィジュネル暗号でテキストを暗号化",
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
      .addStringOption((option) =>
        option
          .setName("key")
          .setDescription("Encryption key")
          .setDescriptionLocalizations({
            ru: "Ключ шифрования",
            uk: "Ключ шифрування",
            ja: "暗号化キー",
          })
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Decode text using Vigenère cipher")
      .setDescriptionLocalizations({
        ru: "Расшифровать текст шифром Виженера",
        uk: "Розшифрувати текст шифром Віженера",
        ja: "ヴィジュネル暗号でテキストを復号化",
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
      .addStringOption((option) =>
        option
          .setName("key")
          .setDescription("Decryption key")
          .setDescriptionLocalizations({
            ru: "Ключ расшифровки",
            uk: "Ключ розшифрування",
            ja: "復号化キー",
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

function vigenere(text: string, key: string, encode: boolean): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!normalizedKey) return text;

  return text
    .toUpperCase()
    .split("")
    .map((char, i) => {
      if (!alphabet.includes(char)) return char;
      const keyChar = normalizedKey[i % normalizedKey.length];
      const shift = encode
        ? alphabet.indexOf(keyChar)
        : -alphabet.indexOf(keyChar);
      const newIndex = (alphabet.indexOf(char) + shift + 26) % 26;
      return alphabet[newIndex];
    })
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");
  const key = interaction.options.getString("key");

  try {
    const resultText = vigenere(text, key, subcommand === "encode");
    const fileName = `${subcommand}d_vigenere.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields(
        { name: client.getLocale(locale, "vigenere.input"), value: text },
        { name: client.getLocale(locale, "vigenere.key"), value: key }
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "vigenere.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
