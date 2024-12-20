import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("rot47")
  .setDescription("Convert text using ROT47 cipher (includes symbols!)")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст шифром ROT47 (включая символы!)",
    uk: "Перетворити текст шифром ROT47 (включно з символами!)",
    ja: "ROT47暗号でテキストを変換（記号も含む！）",
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
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function rot47(text: string): string {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(33 + ((code + 14) % 94));
      }
      return char;
    })
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const text = interaction.options.getString("text");

  try {
    const resultText = rot47(text);
    const fileName = "rot47.txt";

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "rot47.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "rot47.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
