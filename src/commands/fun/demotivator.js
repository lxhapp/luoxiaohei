import {
  SlashCommandBuilder,
  InteractionContextType,
  AttachmentBuilder,
} from "discord.js";  
import { createCanvas, loadImage } from "canvas";
import path from "path";

export const beta = false;
export const cooldown = 10;
export const data = new SlashCommandBuilder()
  .setName("demotivator")
  .setDescription("Create a demotivator poster")
  .setDescriptionLocalizations({
    ru: "Создать демотиватор",
    uk: "Створити демотиватор",
    ja: "デモチベーターポスターを作成",
  })
  .addAttachmentOption((option) =>
    option
      .setName("image")
      .setDescription("Image for the demotivator")
      .setDescriptionLocalizations({
        ru: "Изображение для демотиватора",
        uk: "Зображення для демотиватора",
        ja: "デモチベーター用の画像",
      })
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("Main text of the demotivator (max 20 characters)")
      .setDescriptionLocalizations({
        ru: "Основной текст демотиватора (макс. 20 символов)",
        uk: "Основний текст демотиватора (макс. 20 символів)",
        ja: "デモチベーターのメインテキスト (最大20文字)",
      })
      .setRequired(true)
      .setMaxLength(20)
  )
  .addStringOption((option) =>
    option
      .setName("subtitle")
      .setDescription("Additional text below the title (max 30 characters)")
      .setDescriptionLocalizations({
        ru: "Дополнительный текст под заголовком (макс. 30 символов)",
        uk: "Додатковий текст під заголовком (макс. 30 символів)",
        ja: "タイトルの下の追加テキスト (最大30文字)",
      })
      .setMaxLength(30)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

const imageProperties = {
  width: 714,
  height: 745,
};

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function createDemotivator(imageUrl, title, subtitle) {
  const canvas = createCanvas(imageProperties.width, imageProperties.height);
  const ctx = canvas.getContext("2d");

  // Load background and user image
  const bg = await loadImage(
    path.join(process.cwd(), "assets", "demotivator.png")
  );
  const userImage = await loadImage(imageUrl);

  // Draw background
  ctx.drawImage(bg, 0, 0);

  // Draw user image
  ctx.drawImage(userImage, 46, 46, 622, 551);

  // Draw title with wrapping (max 2 lines)
  ctx.font = "48px Times New Roman";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  const titleLines = wrapText(ctx, title, 600).slice(0, 2); // Limit to 2 lines
  titleLines.forEach((line, index) => {
    ctx.fillText(line, 345, 660 + index * 50);
  });

  // Draw subtitle if provided (max 2 lines)
  if (subtitle) {
    ctx.font = "normal 40px Times New Roman";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    const subtitleLines = wrapText(ctx, subtitle, 600).slice(0, 2); // Limit to 2 lines
    const titleOffset = (titleLines.length - 1) * 50; // Adjust for title wrapping
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, 346, 710 + titleOffset + index * 42);
    });
  }

  return canvas.toBuffer("image/png");
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const image = interaction.options.getAttachment("image");
  const title = interaction.options.getString("title");
  const subtitle = interaction.options.getString("subtitle");

  // Validate image
  if (!image.contentType?.startsWith("image/")) {
    return interaction.editReply({
      content: client.getLocale(locale, "demotivator.errors.invalidImage"),
      ephemeral: true,
    });
  }

  try {
    const buffer = await createDemotivator(image.url, title, subtitle);

    const attachment = new AttachmentBuilder(buffer, {
      name: "demotivator.png",
    });

    await interaction.editReply({
      files: [attachment],
    });
  } catch (error) {
    console.error("Demotivator creation error:", error);
    await interaction.editReply({
      content: client.getLocale(locale, "demotivator.errors.creationFailed"),
      ephemeral: true,
    });
  }
}
