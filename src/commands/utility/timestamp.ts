import {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 12;
export const data = new SlashCommandBuilder()
  .setName("timestamp")
  .setDescription("Create your own timestamp message")
  .setDescriptionLocalizations({
    ru: "Создайте собственное сообщение с временной меткой",
    uk: "Створіть власне повідомлення з міткою часу",
    ja: "自分のタイムスタンプメッセージを作成する",
  })
  .addIntegerOption((option) =>
    option
      .setName("ticks")
      .setDescription("Time in ticks (-7200 = 01.01.1970)")
      .setDescriptionLocalizations({
        ru: "Время в тиках (-7200 = 01.01.1970)",
        uk: "Час у тиках (-7200 = 01.01.1970)",
        ja: "タイクスの時間 (-7200 = 01.01.1970)",
      })
      .setRequired(true)
  );
export async function run({ interaction, client }) {
  const { locale } = interaction;
  const ticks = interaction.options.getInteger("ticks");
  const tickmenu = new StringSelectMenuBuilder()
    .setCustomId("tickmenu")
    .setPlaceholder(client.getLocale(locale, `timestamp.placeholder`))
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("0:00")
        .setDescription(client.getLocale(locale, `timestamp.time_1desc`))
        .setValue(`<t:${ticks}:t>`),
      new StringSelectMenuOptionBuilder()
        .setLabel("0:00:00")
        .setDescription(client.getLocale(locale, `timestamp.time_2desc`))
        .setValue(`<t:${ticks}:T>`),
      new StringSelectMenuOptionBuilder()
        .setLabel("01.01.1970")
        .setDescription(client.getLocale(locale, `timestamp.time_3desc`))
        .setValue(`<t:${ticks}:d>`),
      new StringSelectMenuOptionBuilder()
        .setLabel(client.getLocale(locale, `timestamp.time_1label`))
        .setDescription(client.getLocale(locale, `timestamp.time_4desc`))
        .setValue(`<t:${ticks}:D>`),
      new StringSelectMenuOptionBuilder()
        .setLabel(client.getLocale(locale, `timestamp.time_2label`))
        .setDescription(client.getLocale(locale, `timestamp.time_5desc`))
        .setValue(`<t:${ticks}:f>`),
      new StringSelectMenuOptionBuilder()
        .setLabel(client.getLocale(locale, `timestamp.time_3label`))
        .setDescription(client.getLocale(locale, `timestamp.time_6desc`))
        .setValue(`<t:${ticks}:F>`),
      new StringSelectMenuOptionBuilder()
        .setLabel(client.getLocale(locale, `timestamp.time_4label`))
        .setDescription(client.getLocale(locale, `timestamp.time_7desc`))
        .setValue(`<t:${ticks}:R>`)
    );

  const row = new ActionRowBuilder().addComponents(tickmenu);

  const msg = await interaction.editReply({
    components: [row],
    allowedMentions: {
      repliedUser: false,
    },
  });
  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 0,
  });
  collector.on("collect", async (i) => {
    if (i.user === interaction.user) {
      const selection = i.values[0];
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(`\`${selection}\``)
        .setTitle(selection);
      await i.reply({
        embeds: [embed],
        allowedMentions: {
          repliedUser: false,
        },
      });

      msg.delete();
    }
  });
}
