import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

const LEET_MAP = {
  a: "4",
  b: "8",
  e: "3",
  g: "6",
  i: "1",
  l: "1",
  o: "0",
  s: "5",
  t: "7",
  z: "2",
  A: "4",
  B: "8",
  E: "3",
  G: "6",
  I: "1",
  L: "1",
  O: "0",
  S: "5",
  T: "7",
  Z: "2",
};

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("leet")
  .setDescription("Convert text to 1337speak")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст в 1337speak",
    uk: "Перетворити текст у 1337speak",
    ja: "テキストを1337speakに変換する",
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

function textToLeet(text: string): string {
  return text
    .split("")
    .map((char) => LEET_MAP[char] || char)
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const text = interaction.options.getString("text");

  try {
    const resultText = textToLeet(text);
    const fileName = "leet.txt";

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "leet.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "leet.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
