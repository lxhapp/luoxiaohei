import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";

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

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const embed = new EmbedBuilder().setColor(client.embedColor);

  try {
    const response = await axios.get("https://api.api-ninjas.com/v1/facts", {
      headers: {
        "X-Api-Key": "9uDtqyQHdTHJjEmEIrcbCg==vOxsk9livTKn4D1m",
      },
    });

    if (!response.data?.[0]?.fact) {
      throw new Error("Invalid response format");
    }

    let description = client.getLocale(locale, "fact.description");
    description = description.replace("{{fact}}", response.data[0].fact);

    embed.setDescription(description);
  } catch (error) {
    console.error("Error in fact command:", error);
    embed.setDescription(client.getLocale(locale, "fact.errors.fetch"));
  }

  return interaction.editReply({
    embeds: [embed],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
