import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import request from "request";
const url = "https://api.thecatapi.com/v1/images/search";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("cat")
  .setDescription("Generates random cat image")
  .setDescriptionLocalizations({
    ru: "Генерирует случайное изображение кошки",
    uk: "Генерує випадкове зображення кота",
    ja: "ランダムな猫の画像を生成します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const { locale } = interaction;
  const catembed = new EmbedBuilder().setColor(client.embedColor);
  request(
    {
      url: url,
      json: true,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (Array.isArray(body)) {
          body.forEach((catObject) => {
            catembed.setImage(catObject.url);
            catembed.setTitle(client.getLocale(locale, `cat.title`));
            catembed.setTimestamp();
            catembed.setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            });

            interaction.editReply({
              embeds: [catembed],
              allowedMentions: {
                repliedUser: false,
              },
              flags: [4096],
            });
          });
          return;
        } else if (typeof body === "object") {
          catembed.setImage(body.url);
          catembed.setTitle(client.getLocale(locale, `cat.title`));
          catembed.setTimestamp();
          catembed.setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          });

          interaction.editReply({
            embeds: [catembed],
            allowedMentions: {
              repliedUser: false,
            },
            flags: [4096],
          });
          return;
        } else {
          catembed.setDescription(client.getLocale(locale, `cat.errors.fail`));
          interaction.editReply({
            embeds: [catembed],
            allowedMentions: {
              repliedUser: false,
            },
            flags: [4096],
          });
          client.error("Unexpected response format:", body);
          return;
        }
      } else {
        catembed.setDescription(client.getLocale(locale, `cat.errors.fail`));
        interaction.editReply({
          embeds: [catembed],
          allowedMentions: {
            repliedUser: false,
          },
          flags: [4096],
        });
        return;
      }
    }
  );
}
