import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import request from "request";
const url = "https://dog.ceo/api/breeds/image/random";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("dog")
  .setDescription("Generates random dog image")
  .setDescriptionLocalizations({
    ru: "Генерирует случайное изображение собаки",
    uk: "Генерує випадкове зображення собаки",
    ja: "ランダムな犬の画像を生成します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const { locale } = interaction;
  const dogembed = new EmbedBuilder().setColor(client.embedColor);
  request(
    {
      url: url,
      json: true,
    },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (Array.isArray(body)) {
          body.forEach((dogObject) => {
            dogembed.setImage(dogObject.message);
            dogembed.setTitle(client.getLocale(locale, `dog.title`));
            dogembed.setTimestamp();
            dogembed.setAuthor({
              name: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL(),
            });

            interaction.editReply({
              embeds: [dogembed],
              allowedMentions: {
                repliedUser: false,
              },

              flags: [4096],
            });
          });
          return;
        } else if (typeof body === "object") {
          dogembed.setImage(body.message);
          dogembed.setTitle(client.getLocale(locale, `dog.title`));
          dogembed.setTimestamp();
          dogembed.setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          });

          interaction.editReply({
            embeds: [dogembed],
            allowedMentions: {
              repliedUser: false,
            },

            flags: [4096],
          });
          return;
        } else {
          dogembed.setDescription(client.getLocale(locale, `dog.errors.fail`));
          interaction.editReply({
            embeds: [dogembed],
            allowedMentions: {
              repliedUser: false,
            },

            flags: [4096],
          });
          console.error("Unexpected response format:", body);
          return;
        }
      } else {
        dogembed.setDescription(client.getLocale(locale, `dog.errors.fail`));
        interaction.editReply({
          embeds: [dogembed],
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
