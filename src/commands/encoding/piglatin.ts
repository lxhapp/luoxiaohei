import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("piglatin")
  .setDescription("Convert text to/from Pig Latin")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст в/из поросячьей латыни",
    uk: "Перетворити текст в/з свинячої латини",
    ja: "ピッグラテン語に/から変換する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Convert text to Pig Latin")
      .setDescriptionLocalizations({
        ru: "Преобразовать текст в поросячью латынь",
        uk: "Перетворити текст у свинячу латинь",
        ja: "テキストをピッグラテン語に変換",
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
      .setDescription("Convert Pig Latin to text")
      .setDescriptionLocalizations({
        ru: "Преобразовать поросячью латынь в текст",
        uk: "Перетворити свинячу латинь в текст",
        ja: "ピッグラテン語をテキストに変換",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to convert back")
          .setDescriptionLocalizations({
            ru: "Текст для обратного преобразования",
            uk: "Текст для зворотного перетворення",
            ja: "テキストに戻す",
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

function wordToPigLatin(word: string): string {
  const vowels = ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"];
  if (!word) return word;

  // Keep track of capitalization
  const isCapitalized = word[0] === word[0].toUpperCase();
  word = word.toLowerCase();

  // Handle words that start with vowels
  if (vowels.includes(word[0])) {
    return isCapitalized
      ? word.charAt(0).toUpperCase() + word.slice(1) + "way"
      : word + "way";
  }

  // Find first vowel position
  let vIndex = 0;
  for (let i = 0; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      vIndex = i;
      break;
    }
  }

  // Handle words with no vowels
  if (vIndex === 0) vIndex = word.length;

  const result = word.slice(vIndex) + word.slice(0, vIndex) + "ay";
  return isCapitalized
    ? result.charAt(0).toUpperCase() + result.slice(1)
    : result;
}

function pigLatinToWord(word: string): string {
  if (!word.endsWith("ay") && !word.endsWith("way")) return word;

  const isCapitalized = word[0] === word[0].toUpperCase();
  word = word.toLowerCase();

  if (word.endsWith("way")) {
    const result = word.slice(0, -3);
    return isCapitalized
      ? result.charAt(0).toUpperCase() + result.slice(1)
      : result;
  }

  const withoutAy = word.slice(0, -2);
  const lastVowelIndex = withoutAy.search(/[aeiou]/);
  if (lastVowelIndex === -1) return word;

  const result =
    withoutAy.slice(lastVowelIndex) + withoutAy.slice(0, lastVowelIndex);
  return isCapitalized
    ? result.charAt(0).toUpperCase() + result.slice(1)
    : result;
}

function convertText(text: string, encode: boolean): string {
  return text
    .split(/\b/)
    .map((word) => (encode ? wordToPigLatin(word) : pigLatinToWord(word)))
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");

  try {
    const resultText = convertText(text, subcommand === "encode");
    const fileName = `${subcommand}d_piglatin.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({
        name: client.getLocale(locale, "piglatin.input"),
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
      .setDescription(client.getLocale(locale, "piglatin.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
