import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("railfence")
  .setDescription("Encode or decode text using Rail Fence cipher")
  .setDescriptionLocalizations({
    ru: "Зашифровать или расшифровать текст шифром железнодорожной изгороди",
    uk: "Зашифрувати або розшифрувати текст шифром залізничної огорожі",
    ja: "レールフェンス暗号でテキストを暗号化/復号化する",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Encode text using Rail Fence")
      .setDescriptionLocalizations({
        ru: "Зашифровать текст шифром железнодорожной изгороди",
        uk: "Зашифрувати текст шифром залізничної огорожі",
        ja: "レールフェンス暗号でテキストを暗号化",
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
          .setName("rails")
          .setDescription("Number of rails (2-10)")
          .setDescriptionLocalizations({
            ru: "Количество рельсов (2-10)",
            uk: "Кількість рейок (2-10)",
            ja: "レールの数 (2-10)",
          })
          .setMinValue(2)
          .setMaxValue(10)
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Decode Rail Fence text")
      .setDescriptionLocalizations({
        ru: "Расшифровать текст шифра железнодорожной изгороди",
        uk: "Розшифрувати текст шифру залізничної огорожі",
        ja: "レールフェンス暗号のテキストを復号化",
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
          .setName("rails")
          .setDescription("Number of rails (2-10)")
          .setDescriptionLocalizations({
            ru: "Количество рельсов (2-10)",
            uk: "Кількість рейок (2-10)",
            ja: "レールの数 (2-10)",
          })
          .setMinValue(2)
          .setMaxValue(10)
          .setRequired(true)
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function encodeRailFence(text: string, rails: number): string {
  const fence = Array(rails)
    .fill("")
    .map(() => Array(text.length).fill(""));
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = text[i];
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction = -direction;
  }

  return fence
    .map((row) => row.join(""))
    .join("")
    .replace(/\s+/g, "");
}

function decodeRailFence(text: string, rails: number): string {
  const fence = Array(rails)
    .fill("")
    .map(() => Array(text.length).fill(""));
  let rail = 0;
  let direction = 1;

  // Mark the zigzag pattern
  for (let i = 0; i < text.length; i++) {
    fence[rail][i] = "*";
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction = -direction;
  }

  // Fill in the marked positions
  let index = 0;
  for (let i = 0; i < rails; i++) {
    for (let j = 0; j < text.length; j++) {
      if (fence[i][j] === "*" && index < text.length) {
        fence[i][j] = text[index++];
      }
    }
  }

  // Read off in zigzag pattern
  let result = "";
  rail = 0;
  direction = 1;
  for (let i = 0; i < text.length; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === rails - 1 || rail === 0) direction = -direction;
  }

  return result;
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");
  const rails = interaction.options.getInteger("rails");

  try {
    const resultText =
      subcommand === "encode"
        ? encodeRailFence(text, rails)
        : decodeRailFence(text, rails);

    const fileName = `${subcommand}d_railfence.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields(
        { name: client.getLocale(locale, "railfence.input"), value: text },
        {
          name: client.getLocale(locale, "railfence.rails"),
          value: rails.toString(),
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
      .setDescription(client.getLocale(locale, "railfence.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
