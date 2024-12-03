import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Invite Luo Xiaohei to your home")
  .setDescriptionLocalizations({
    ru: "Пригласите Ло Сяохэя к себе домой",
    uk: "Запросіть Ло Сяохея до себе додому",
    ja: "ロシャオヘイをあなたの家に招待する",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const { locale } = interaction;
  const invembed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(client.getLocale(locale, "invite.title"))
    .setDescription(client.getLocale(locale, "invite.description"))
    .setImage(
      "https://raw.githubusercontent.com/lxhapp/files/refs/heads/main/thumbnail.png"
    );

  const invBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setEmoji("<:luo:1270401166731382867>")
      .setLabel(client.getLocale(locale, "invite.button"))
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://discordapp.com/oauth2/authorize?client_id=1126444416282927156"
      )
  );

  await interaction.editReply({
    embeds: [invembed],
    components: [invBtn],
    ephemeral: true,
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
