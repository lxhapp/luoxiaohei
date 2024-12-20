import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("atbash")
  .setDescription("Convert text using Atbash cipher (A→Z, B→Y, etc)")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст шифром Атбаш (A→Z, B→Y и т.д.)",
    uk: "Перетворити текст шифром Атбаш (A→Z, B→Y тощо)",
    ja: "アトバシュ暗号でテキストを変換（A→Z、B→Yなど）",
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

function atbash(text: string): string {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90)
        return String.fromCharCode(90 - (code - 65));
      if (code >= 97 && code <= 122)
        return String.fromCharCode(122 - (code - 97));
      return char;
    })
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const text = interaction.options.getString("text");

  try {
    const resultText = atbash(text);
    const fileName = "atbash.txt";

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({
        name: client.getLocale(locale, "atbash.input"),
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
      .setDescription(client.getLocale(locale, "atbash.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
