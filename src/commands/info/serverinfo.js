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
  await interaction.deferReply({
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
  const { guild, locale } = interaction;
  const { name, createdTimestamp } = guild;

  let baseVerif = guild.verificationLevel;
  if (baseVerif === 0) baseVerif = client.getLocale(locale, `nope`);
  if (baseVerif === 1) baseVerif = client.getLocale(locale, `low`);
  if (baseVerif === 2) baseVerif = client.getLocale(locale, `mid`);
  if (baseVerif === 3) baseVerif = client.getLocale(locale, `high`);
  if (baseVerif === 4) baseVerif = client.getLocale(locale, `veryhigh`);

  const sinfoEmbed = new EmbedBuilder()
    .setColor("#212226")
    .setAuthor({
      name: name,
      iconURL: guild.iconURL(),
    })
    .setThumbnail(guild.iconURL())
    .setFooter({
      text: `ID: ${guild.id}`,
    })
    .setTimestamp()
    .addFields({
      name: client.getLocale(locale, `name`),
      value: `${name}`,
      inline: false,
    })
    .addFields({
      name: client.getLocale(locale, `srvCreation`),
      value: `<t:${parseInt(createdTimestamp / 1000)}:R>`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `owner`),
      value: `<@${guild.ownerId}>`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `members`),
      value: `${guild.memberCount}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `roles`),
      value: `${guild.roles.cache.size}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `emoji`),
      value: `${guild.emojis.cache.size}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `veriflvl`),
      value: `${baseVerif}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `boosts`),
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
