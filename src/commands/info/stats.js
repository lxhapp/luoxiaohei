import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 30;
export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Luo Xiaohei's statistics")
  .setDescriptionLocalizations({
    ru: "Статистика Ло Сяохэя",
    uk: "Статистика Ло Сяохея",
    ja: "ルオ・シャオヘイの統計",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const { locale } = interaction;

  const promises = [
    client.shard.fetchClientValues("guilds.cache.size"),
    client.shard.broadcastEval((c) =>
      c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    ),
  ];

  return Promise.all(promises)
    .then((results) => {
      const totalGuilds = results[0].reduce(
        (acc, guildCount) => acc + guildCount,
        0
      );
      const totalMembers = results[1].reduce(
        (acc, memberCount) => acc + memberCount,
        0
      );
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .addFields({
          name: client.getLocale(locale, "servercount"),
          value: `${totalGuilds}`,
        })
        .addFields({
          name: client.getLocale(locale, "membercount"),
          value: `${totalMembers}`,
        });
      return interaction.editReply({ embeds: [embed] });
    })
    .catch(console.error);
}
