import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 30;
export const data = new SlashCommandBuilder()
  .setName("serverinfo")
  .setDescription("Server Information")
  .setDescriptionLocalizations({
    ru: "Информация о сервере",
    uk: "Інформація з серверу",
    ja: "サーバー情報を表示する",
  })
  .setContexts(InteractionContextType.Guild);
export async function run({ interaction, client }) {
  const { guild, locale } = interaction;
  const { name, createdTimestamp } = guild;

  let baseVerif = guild.verificationLevel;
  if (baseVerif === 0) baseVerif = client.getLocale(locale, `serverinfo.nope`);
  if (baseVerif === 1) baseVerif = client.getLocale(locale, `serverinfo.low`);
  if (baseVerif === 2) baseVerif = client.getLocale(locale, `serverinfo.mid`);
  if (baseVerif === 3) baseVerif = client.getLocale(locale, `serverinfo.high`);
  if (baseVerif === 4)
    baseVerif = client.getLocale(locale, `serverinfo.veryhigh`);

  const sinfoEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setAuthor({
      name: name,
      iconURL: guild.iconURL() || null,
    })
    .setThumbnail(guild.iconURL() || null)
    .setFooter({
      text: `ID: ${guild.id}`,
    })
    .setTimestamp()
    .addFields({
      name: client.getLocale(locale, `serverinfo.name`),
      value: `${name}`,
      inline: false,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.creation`),
      value: `<t:${createdTimestamp / 1000}:R>`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.owner`),
      value: `<@${guild.ownerId}>`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.members`),
      value: `${guild.memberCount}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.roles`),
      value: `${guild.roles.cache.size}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.emojis`),
      value: `${guild.emojis.cache.size}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.veriflvl`),
      value: `${baseVerif}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `serverinfo.boosts`),
      value: `${guild.premiumSubscriptionCount}`,
      inline: true,
    });

  const closeBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("close")
      .setEmoji("🗑")
      .setStyle(ButtonStyle.Danger)
  );

  const message = await interaction.editReply({
    embeds: [sinfoEmbed],
    components: [closeBtn],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });

  const collector = message.createMessageComponentCollector();
  collector.on("collect", async (r) => {
    if (r.customId === "close") {
      if (r.user === interaction.user) {
        interaction.deleteReply();
      }
    }
  });
}
