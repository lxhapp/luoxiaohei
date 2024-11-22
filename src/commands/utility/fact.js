import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import request from "request";
const { get } = request;

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("fact")
  .setDescription("Generates random english fact for you")
  .setDescriptionLocalizations({
    ru: "Генерирует для вас случайный английский факт",
    uk: "Генерує для вас випадковий англійський факт",
    ja: "ランダムな英語の事実を生成します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction }) {
  get(
    {
      url: "https://api.api-ninjas.com/v1/facts",
      headers: {
        "X-Api-Key": "9uDtqyQHdTHJjEmEIrcbCg==vOxsk9livTKn4D1m",
      },
    },
    function (error, response, body) {
      if (error) return console.error("Request failed:", error);
      else if (response.statusCode != 200)
        return console.error(response.statusCode, body.toString("utf8"));
      else
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.embedColor)
              .setDescription(
                `<:luo:1270401166731382867> ${JSON.parse(body)[0].fact}`
              ),
          ],
          allowedMentions: {
            repliedUser: false,
          },

          flags: [4096],
        });
    }
  );
}
