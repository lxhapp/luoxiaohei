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
  const { locale } = interaction;
  const embed = new EmbedBuilder().setColor(client.embedColor);

  // Check for both required permissions
  const requiredPermissions = [
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ViewChannel
  ];

  const missingPermissions = requiredPermissions.filter(
    perm => !interaction.guild.members.me.permissions.has(perm)
  );

  if (missingPermissions.length > 0) {
    embed.setDescription(client.getLocale(locale, "purge.noperms"));
    return await interaction.editReply({
      embeds: [embed],
    });
  }

  try {
    const amount = interaction.options.getNumber("amount");
    const fetchedMessages = await interaction.channel.messages.fetch({
      limit: amount,
    });

    if (fetchedMessages.size === 0) {
      embed.setDescription(client.getLocale(locale, "purge.nomsgs"));
      return await interaction.editReply({
        embeds: [embed],
      });
    }

    await interaction.channel.bulkDelete(fetchedMessages, true);

    return interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            client.getLocale(locale, "purge.success")
              .replace("${fetchedMessages}", fetchedMessages.size)
          )
          .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
    });
  } catch (error) {
    console.error('Purge error:', error);
  }
}
