import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

const MORSE_CODE = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  " ": "/",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "@": ".--.-.",
};

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("morse")
  .setDescription("Convert text to/from Morse code")
  .setDescriptionLocalizations({
    ru: "Преобразовать текст в/из азбуки Морзе",
    uk: "Перетворити текст в/з абетки Морзе",
    ja: "テキストをモールス信号に/から変換する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Convert text to Morse code")
      .setDescriptionLocalizations({
        ru: "Преобразовать текст в азбуку Морзе",
        uk: "Перетворити текст в абетку Морзе",
        ja: "テキストをモールス信号に変換",
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
      .setDescription("Convert Morse code to text")
      .setDescriptionLocalizations({
        ru: "Преобразовать азбуку Морзе в текст",
        uk: "Перетворити абетку Морзе в текст",
        ja: "モールス信号をテキストに変換",
      })
      .addStringOption((option) =>
        option
          .setName("morse")
          .setDescription("Morse code to convert")
          .setDescriptionLocalizations({
            ru: "Код Морзе для преобразования",
            uk: "Код Морзе для перетворення",
            ja: "変換するモールス信号",
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

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((char) => MORSE_CODE[char] || char)
    .join(" ");
}

function morseToText(morse: string): string {
  const reverseMorse = Object.fromEntries(
    Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
  );
  return morse
    .split(" ")
    .map((code) => reverseMorse[code] || code)
    .join("");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString(
    subcommand === "encode" ? "text" : "morse"
  );

  try {
    const resultText =
      subcommand === "encode" ? textToMorse(text) : morseToText(text);
    const fileName = `${subcommand}d_morse.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "morse.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "morse.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
