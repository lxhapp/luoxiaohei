import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Purge messages with specified amount")
  .setDescriptionLocalizations({
    ru: "Очистка сообщений с указанным количеством",
    uk: "Видалення повідомлень із зазначеною сумою",
    ja: "指定された量のメッセージを削除する",
  })
  .addNumberOption((option) =>
    option
      .setName("amount")
      .setDescription("Specify a amount for messages to be deleted")
      .setDescriptionLocalizations({
        ru: "Укажите количество удаляемых сообщений",
        uk: "Видалення повідомлень із зазначеною сумою",
        ja: "削除するメッセージの量を指定します",
      })
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
  )
  .setContexts(InteractionContextType.Guild)
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages);
export async function run({ interaction, client }) {
  await interaction.deferReply({
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
  const { locale } = interaction;
  const embed = new EmbedBuilder().setColor("#212226");
  if (
    !interaction.guild.members.me.permissions.has(
      PermissionsBitField.Flags.ManageMessages
    )
  ) {
    embed.setDescription(client.getLocale(locale, "purge_noperms"));
    return await interaction.editReply({
      embeds: [embed],
    });
  }

  const amount = interaction.options.getNumber("amount");
  const fetchedMessages = await interaction.channel.messages.fetch({
    limit: amount,
  });
  await interaction.channel.bulkDelete(fetchedMessages, true);

  interaction.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("#212226")
        .setDescription(
          fetchedMessages === 0
            ? client.getLocale(locale, "purge_nomsgs")
            : client
                .getLocale(locale, "purgeSuccess")
                .replace("${fetchedMessages}", amount)
        )
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        }),
    ],
  });
}
