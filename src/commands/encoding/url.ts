import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("url")
  .setDescription("Encode or decode URL text")
  .setDescriptionLocalizations({
    ru: "Кодировать или декодировать URL-текст",
    uk: "Кодувати або декодувати URL-текст",
    ja: "URLテキストをエンコード/デコードする",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("encode")
      .setDescription("Encode text for URLs")
      .setDescriptionLocalizations({
        ru: "Кодировать текст для URL",
        uk: "Кодувати текст для URL",
        ja: "URLのテキストをエンコード",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to encode")
          .setDescriptionLocalizations({
            ru: "Текст для кодирования",
            uk: "Текст для кодування",
            ja: "エンコードするテキスト",
          })
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("decode")
      .setDescription("Decode URL-encoded text")
      .setDescriptionLocalizations({
        ru: "Декодировать URL-кодированный текст",
        uk: "Декодувати URL-кодований текст",
        ja: "URLエンコードされたテキストをデコード",
      })
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("Text to decode")
          .setDescriptionLocalizations({
            ru: "Текст для декодирования",
            uk: "Текст для декодування",
            ja: "デコードするテキスト",
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

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();
  const text = interaction.options.getString("text");

  try {
    const resultText =
      subcommand === "encode"
        ? encodeURIComponent(text)
        : decodeURIComponent(text);

    const fileName = `${subcommand}d_url.txt`;

    const resultEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .addFields({ name: client.getLocale(locale, "url.input"), value: text })
      .setTimestamp();

    await interaction.editReply({
      embeds: [resultEmbed],
      files: [{ attachment: Buffer.from(resultText), name: fileName }],
    });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "url.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
