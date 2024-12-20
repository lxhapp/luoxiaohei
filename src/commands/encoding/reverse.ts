import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("reverse")
  .setDescription("Reverse text in different ways")
  .setDescriptionLocalizations({
    ru: "Перевернуть текст разными способами",
    uk: "Перевернути текст різними способами",
    ja: "テキストを様々な方法で反転する",
  })
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("Text to reverse")
      .setDescriptionLocalizations({
        ru: "Текст для переворота",
        uk: "Текст для перевертання",
        ja: "反転するテキスト",
      })
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("mode")
      .setDescription("How to reverse the text")
      .setDescriptionLocalizations({
        ru: "Как перевернуть текст",
        uk: "Як перевернути текст",
        ja: "テキストの反転方法",
      })
      .setRequired(true)
      .addChoices(
        { name: "Full", value: "full" },
        { name: "Words", value: "words" },
        { name: "Letters", value: "letters" }
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function reverseText(text: string, mode: string): string {
  switch (mode) {
    case "full":
      return text.split("").reverse().join("");
    case "words":
      return text.split(" ").reverse().join(" ");
    case "letters":
      return text
        .split(" ")
        .map((word) => word.split("").reverse().join(""))
        .join(" ");
    default:
      return text;
  }
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const text = interaction.options.getString("text");
  const mode = interaction.options.getString("mode");

  try {
    const resultText = reverseText(text, mode);
    const fileName = "reversed.txt";

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields(
        { name: client.getLocale(locale, "reverse.input"), value: text },
        { name: client.getLocale(locale, "reverse.mode"), value: mode }
      )
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "reverse.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
