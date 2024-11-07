import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 3;
export const data = new SlashCommandBuilder()
  .setName("uptime")
  .setDescription("Replies with the bots uptime")
  .setDescriptionLocalizations({
    ru: "Отвечает с время работы бота",
    uk: "Відповідає з час роботи бота",
    ja: "現在のボットの稼働時間を返します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const launchTimestamp = Math.floor(Date.now() - client.uptime);
  let totalSeconds = client.uptime / 1000;
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);

  const embed = new EmbedBuilder()
    .setColor("#212226")
    .setDescription(`**${days}d ${hours}h ${minutes}m ${seconds}s**`)
    .setTimestamp(launchTimestamp);

  interaction.editReply({
    embeds: [embed],
  });
}
