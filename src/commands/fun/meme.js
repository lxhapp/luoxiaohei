import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

import request from "request";
import { promisify } from "util";

const getAsync = promisify(request.get);
const postAsync = promisify(request.post);

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("meme")
  .setDescription("Get a random meme")
  .setDescriptionLocalizations({
    ru: "Получить случайный мем",
    uk: "Отримайте випадковий мем",
    ja: "ランダムなミームを取得する",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

async function getRedditToken() {
  const authOptions = {
    url: "https://www.reddit.com/api/v1/access_token",
    auth: {
      username: process.env.REDDIT_CLIENT_ID,
      password: process.env.REDDIT_CLIENT_SECRET,
    },
    form: {
      grant_type: "password",
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD,
    },
    headers: {
      "User-Agent": "LuoXiaohei/7.11.24",
    },
    json: true,
  };

  const response = await postAsync(authOptions);
  return response.body.access_token;
}

async function getRandomMeme(token, subreddit) {
  const options = {
    url: `https://oauth.reddit.com/r/${subreddit}/hot.json?limit=100`,
    headers: {
      "User-Agent": "DiscordBot/1.0.0",
      Authorization: `Bearer ${token}`,
    },
    json: true,
  };

  const response = await getAsync(options);
  return response.body;
}

export async function run({ interaction, client }) {
  const subreddits = [
    "memes",
    "me_irl",
    "dankmemes",
    "comedyheaven",
    "Animemes",
  ];
  const selectedSubreddit =
    subreddits[Math.floor(Math.random() * subreddits.length)];

  try {
    // Get access token
    const token = await getRedditToken();

    // Get meme data
    const data = await getRandomMeme(token, selectedSubreddit);

    if (!data?.data?.children?.length) {
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

    // Filter posts that have images
    const imagePosts = data.data.children.filter((post) =>
      post.data.url?.match(/\.(jpg|jpeg|png|gif)$/i)
    );

    if (!imagePosts.length) {
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

    // Get a random image post
    const post = imagePosts[Math.floor(Math.random() * imagePosts.length)].data;

    const embed = new EmbedBuilder()
      .setColor("#212226")
      .setURL(`https://reddit.com${post.permalink}`)
      .setTitle(post.title)
      .setDescription(
        `-# **[u/${post.author}](https://www.reddit.com/user/${post.author}/)**`
      )
      .setImage(post.url)
      .setFooter({
        text: `⬆️ ${post.ups.toLocaleString()} | 💬 ${post.num_comments.toLocaleString()} | 📍 r/${selectedSubreddit}`,
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Meme command error:", error);
  }
}
