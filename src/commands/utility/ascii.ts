import {
  SlashCommandBuilder,
  InteractionContextType,
  AttachmentBuilder,
} from "discord.js";
import { promisify } from "util";
import figlet from "figlet";

const figletAsync = promisify<string, figlet.Options, string>(figlet);

export const beta = false;
export const cooldown = 30;
export const data = new SlashCommandBuilder()
  .setName("ascii")
  .setDescription("Convert specified text to ASCII")
  .setDescriptionLocalizations({
    ru: "Преобразование указанного текста в ASCII",
    uk: "Перетворити вказаний текст в ASCII",
    ja: "指定されたテキストをASCIIに変換します",
  })
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("Specify the text to start converting")
      .setDescriptionLocalizations({
        ru: "Укажите текст, который нужно начать преобразовывать",
        uk: "Вкажіть текст для початку перетворення",
        ja: "変換を開始するテキストを指定します",
      })
      .setMaxLength(512)
      .setMinLength(1)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("font")
      .setDescription(
        "http://www.figlet.org/examples.html | Specify the font you want to convert"
      )
      .setDescriptionLocalizations({
        ru: "http://www.figlet.org/examples.html | Укажите шрифт, который нужно начать преобразовывать",
        uk: "http://www.figlet.org/examples.html | Вкажіть шріфт для початку перетворення",
        ja: "http://www.figlet.org/examples.html | 変換を開始するフォントを指定します",
      })
      .setMaxLength(32)
      .setMinLength(1)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  const { locale } = interaction;

  try {
    const text = interaction.options.getString("text");
    let font = interaction.options.getString("font") || "Standard";
    font = font.charAt(0).toUpperCase() + font.slice(1).toLowerCase();

    if (!figlet.fontsSync().includes(font)) {
      return interaction.editReply({
        content: client.getLocale(locale, "ascii.errors.fontInvalid"),
        ephemeral: true,
      });
    }

    const asciiArt = await figletAsync(text, {
      font: font,
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    });

    if (asciiArt.length > 8e6) {
      return interaction.editReply({
        content: client.getLocale(locale, "ascii.errors.asciiLong"),
        ephemeral: true,
      });
    }

    const attachment = new AttachmentBuilder(Buffer.from(asciiArt), {
      name: "ascii.txt",
    });

    await interaction.editReply({
      content: client.getLocale(locale, "ascii.success"),
      files: [attachment],
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply({
      content: client.getLocale(locale, "ascii.errors.asciiError"),
      ephemeral: true,
    });
  }
}
