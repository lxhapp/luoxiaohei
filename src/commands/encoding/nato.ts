import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

const NATO_ALPHABET = {
  A: "Alpha",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliett",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "X-ray",
  Y: "Yankee",
  Z: "Zulu",
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("nato")
  .setDescription("Convert text to NATO phonetic alphabet")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст в фонетический алфавит НАТО",
    uk: "Перетворити текст у фонетичний алфавіт НАТО",
    ja: "テキストをNATO音標文字に変換する",
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

function textToNATO(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((char) => NATO_ALPHABET[char] || char)
    .join(" ");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const text = interaction.options.getString("text");

  try {
    const resultText = textToNATO(text);
    const fileName = "nato.txt";

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "nato.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "nato.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
