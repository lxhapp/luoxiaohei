import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";

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

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const embed = new EmbedBuilder().setColor(client.embedColor);

  try {
    const response = await axios.get("https://meme-api.com/gimme");
    const meme = response.data;

    // Check if meme is NSFW and skip if needed
    if (meme.nsfw) {
      return interaction.editReply({
        content: client.getLocale(locale, "meme.errors.nsfw_content"),
      });
    }

    let description = client.getLocale(locale, "meme.description");
    description = description
      .replace("{{author}}", meme.author)
      .replace("{{subreddit}}", meme.subreddit);

    let footerText = client.getLocale(locale, "meme.footer");
    footerText = footerText.replace("{{upvotes}}", meme.ups.toString());

    embed
      .setURL(meme.postLink)
      .setTitle(meme.title)
      .setDescription(description)
      .setImage(meme.url)
      .setFooter({
        text: footerText,
      })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Meme command error:", error);

    const errorTitle = client.getLocale(locale, "meme.errors.title");
    const errorDescription = client.getLocale(locale, "meme.errors.fetch");

    embed
      .setTitle(errorTitle)
      .setDescription(errorDescription)
      .setColor(client.embedColor);

    return interaction.editReply({ embeds: [embed] });
  }
}
