import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

import fetch from "node-fetch";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("meme")
  .setDescription("Get the meme")
  .setDescriptionLocalizations({
    ru: "Получить мем",
    uk: "Отримати мем",
    ja: "ミームを取得",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const Reds = ["memes", "me_irl", "dankmemes", "comedyheaven", "Animemes"];

  const Rads = Reds[Math.floor(Math.random() * Reds.length)];
  const res = await fetch(`https://www.reddit.com/r/${Rads}/random/.json`);
  const json = await res.json();
  if (!json[0]) {
    const embed = new EmbedBuilder()
      .setColor("#212226")
      .setTitle("No Content")
      .setDescription("http.cat")
      .setImage("https://http.cat/images/204.jpg")
      .setTimestamp();
    return interaction.editReply({
      embeds: [embed],
    });
  }
  const data = json[0].data.children[0].data;
  const embed = new EmbedBuilder()
    .setColor("#212226")
    .setURL(`https://reddit.com${data.permalink}`)
    .setTitle(data.title)
    .setDescription(
      `-# **[r/${data.author}](https://www.reddit.com/r/${data.author}/)**`
    )
    .setImage(data.url)
    .setFooter({
      text: `${data.ups || 0} 👍 | ${data.num_comments || 0} 💬`,
    })
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
}
