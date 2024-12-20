import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("rot13")
  .setDescription("Encode or decode text using ROT13 cipher")
  .setDescriptionLocalizations({
    ru: "Зашифровать или расшифровать текст шифром ROT13",
    uk: "Зашифрувати або розшифрувати текст шифром ROT13",
    ja: "ROT13暗号でテキストを暗号化/復号化する",
  })
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("Text to encode/decode")
      .setDescriptionLocalizations({
        ru: "Текст для шифрования/дешифрования",
        uk: "Текст для шифрування/дешифрування",
        ja: "暗号化/復号化するテキスト",
      })
      .setRequired(true)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const isUpperCase = char === char.toUpperCase();
    const baseCode = isUpperCase ? 65 : 97;
    return String.fromCharCode(baseCode + ((code - baseCode + 13) % 26));
  });
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const text = interaction.options.getString("text");

  try {
    const resultText = rot13(text);
    const fileName = "rot13.txt";

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "rot13.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "rot13.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
