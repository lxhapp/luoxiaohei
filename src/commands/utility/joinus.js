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
  .setName("joinus")
  .setDescription("Join our server, Luo Cat!")
  .setDescriptionLocalizations({
    ru: "Присоединяйся к нашему серверу, Luo Cat!",
    uk: "Приєднуйся до нашого сервера, Luo Cat!",
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
    .setThumbnail(
      "https://cdn.discordapp.com/icons/1269712356963909766/57bfcefb7b254ebd2b2dd57c1aade05c.webp"
    )
    .setDescription(
      `${client.getLocale(locale, "joinusdesc")}\n${client.getLocale(
        locale,
        "btnisntfunc"
      )} https://dsc.gg/luocat`
    );

  const joinBtn = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setEmoji("<:luo:1270401166731382867>")
      .setStyle(ButtonStyle.Link)
      .setURL("https://discord.gg/8pQNPFnBph")
  );

  await interaction.editReply({
    embeds: [invembed],
    components: [joinBtn],
    ephemeral: true,
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
