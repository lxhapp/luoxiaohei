import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const beta = false;
export const cooldown = 4;
export const data = new SlashCommandBuilder()
  .setName("luck")
  .setDescription("Test your luck by random")
  .setDescriptionLocalizations({
    ru: "Проверьте свою удачу случайным образом",
    uk: "Випробуйте удачу випадковим чином",
    ja: "ランダムな方法で運を試してください",
  })
  .addIntegerOption((option) =>
    option
      .setName("1")
      .setDescription("The value, for example 47")
      .setDescriptionLocalizations({
        ru: "Значение, например, 47",
        uk: "Значення, наприклад 47",
        ja: "例えば47",
      })
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("2")
      .setDescription("The 2nd value, for example 63")
      .setDescriptionLocalizations({
        ru: "Второе значение, например 63",
        uk: "2-е значення, наприклад 63",
        ja: "例えば63",
      })
      .setRequired(true)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const val1 = interaction.options.getInteger("1");
  const val2 = interaction.options.getInteger("2");
  const { locale } = interaction;
  if (val1 < val2) {
    const random = getRandom(val2, val1);
    const result = getRandom(val2, val1);
    if (random === result) {
      const luckembed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(client.getLocale(locale, "luckyrandom"))
        .addFields({
          name: client.getLocale(locale, "random"),
          value: `${random}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "result"),
          value: `${result}`,
          inline: true,
        });
      await interaction.editReply({
        embeds: [luckembed],
        allowedMentions: {
          repliedUser: false,
        },
        flags: [4096],
      });
    } else {
      const luckembed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(client.getLocale(locale, "unluckyrandom"))
        .addFields({
          name: client.getLocale(locale, "random"),
          value: `${random}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "result"),
          value: `${result}`,
          inline: true,
        });
      await interaction.editReply({
        embeds: [luckembed],
        allowedMentions: {
          repliedUser: false,
        },
        flags: [4096],
      });
    }
  } else {
    const random = getRandom(val1, val2);
    const result = getRandom(val1, val2);
    if (random === result) {
      const luckembed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(client.getLocale(locale, "luckyrandom"))
        .addFields({
          name: client.getLocale(locale, "random"),
          value: `${random}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "result"),
          value: `${result}`,
          inline: true,
        });
      await interaction.editReply({
        embeds: [luckembed],
        allowedMentions: {
          repliedUser: false,
        },
        flags: [4096],
      });
    } else {
      const luckembed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor(client.embedColor)
        .setDescription(client.getLocale(locale, "unluckyrandom"))
        .addFields({
          name: client.getLocale(locale, "random"),
          value: `${random}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "result"),
          value: `${result}`,
          inline: true,
        });
      await interaction.editReply({
        embeds: [luckembed],
        allowedMentions: {
          repliedUser: false,
        },
        flags: [4096],
      });
    }
  }
}
