import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with the bots current ping")
  .setDescriptionLocalizations({
    ru: "Отвечает с текущему пинг бота",
    uk: "Відповідає з поточним пінг бота",
    ja: "現在のボットのピンを返します",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const { locale } = interaction;
  const pingembed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setDescription(client.getLocale(locale, `pinging`));

  const sent = await interaction.followUp({
    embeds: [pingembed],
    fetchReply: true,
  });
  pingembed.setDescription(
    `🌸 **${
      sent.createdTimestamp - interaction.createdTimestamp
    }${client.getLocale(locale, "ms")}**`
  );
  interaction.editReply({
    embeds: [pingembed],
    fetchReply: true,
  });
}
