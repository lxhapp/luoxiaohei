import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";

export const beta = false;
export const cooldown = 4;

export const data = new SlashCommandBuilder()
  .setName("automod")
  .setDescription("Configure AutoMod rules for the server")
  .setDescriptionLocalizations({
    ru: "Настройка правил AutoMod для сервера",
    uk: "Налаштування правил AutoMod для сервера",
    ja: "サーバーのAutoModルールを設定する",
  })
  .addSubcommand((subcmd) =>
    subcmd
      .setName("flagged-words")
      .setDescription("Block profanity, sexual content, and slurs")
      .setDescriptionLocalizations({
        ru: "Блокировать ненормативную лексику, сексуальный контент и оскорбления",
        uk: "Блокувати ненормативну лексику, сексуальний контент та образи",
        ja: "不正な言葉、性的なコンテンツ、および侮辱をブロックする",
      })
  )
  .addSubcommand((subcmd) =>
    subcmd
      .setName("spam-messages")
      .setDescription("Block messages suspected of spam")
      .setDescriptionLocalizations({
        ru: "Блокировать сообщения, подозреваемые в спаме",
        uk: "Блокувати повідомлення з підозрою на спам",
        ja: "スパムの疑いがあるメッセージをブロックする",
      })
  )
  .addSubcommand((subcmd) =>
    subcmd
      .setName("mention-spam")
      .setDescription("Block messages containing a certain amount of mentions")
      .setDescriptionLocalizations({
        ru: "Блокировать сообщения, содержащие определенное количество упоминаний",
        uk: "Блокувати повідомлення з певною кількістю згадувань",
        ja: "特定の量のメンションを含むメッセージをブロックする",
      })
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("Amount of mentions to trigger the rule")
          .setDescriptionLocalizations({
            ru: "Количество упоминаний для срабатывания правила",
            uk: "Кількість згадувань для спрацювання правила",
            ja: "特定の量のメンションを含むメッセージをブロックするためにはメンションの量が必要です",
          })
          .setRequired(true)
          .setMinValue(2)
          .setMaxValue(50)
      )
  )
  .addSubcommand((subcmd) =>
    subcmd
      .setName("keyword")
      .setDescription("Block a given keyword in the server")
      .setDescriptionLocalizations({
        ru: "Заблокировать заданное ключевое слово на сервере",
        uk: "Блокувати задане ключове слово на сервері",
        ja: "指定されたキーワードをサーバーでブロックする",
      })
      .addStringOption((option) =>
        option
          .setName("word")
          .setDescription("The specified word you want to block")
          .setDescriptionLocalizations({
            ru: "Указанное слово, которое вы хотите заблокировать",
            uk: "Вказане слово, яке потрібно заблокувати",
            ja: "指定されたキーワードをサーバーでブロックするためにはキーワードの値が必要です",
          })
          .setRequired(true)
      )
  )
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
  .setContexts(InteractionContextType.Guild);

export async function run({ interaction, client }) {
  const { guild, options, locale } = interaction;

  await interaction.deferReply({ ephemeral: true });

  const embed = new EmbedBuilder().setColor("#212226");

  if (
    !guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)
  ) {
    embed.setDescription(client.getLocale(locale, "automod_noperms"));
    return await interaction.editReply({ embeds: [embed] });
  }

  const subcommand = options.getSubcommand();

  try {
    let rule;
    switch (subcommand) {
      case "flagged-words":
        rule = await createFlaggedWordsRule(guild, interaction);
        break;
      case "spam-messages":
        rule = await createSpamMessagesRule(guild, interaction);
        break;
      case "mention-spam":
        rule = await createMentionSpamRule(guild, interaction, options);
        break;
      case "keyword":
        rule = await createKeywordRule(guild, interaction, options);
        break;
    }

    if (rule) {
      embed.setDescription(client.getLocale(locale, `automod_success1`));
    } else {
      embed.setDescription(client.getLocale(locale, "automod_ison"));
    }
  } catch (error) {
    console.error("Error creating AutoMod rule:", error);
    embed.setDescription(client.getLocale(locale, "automod_error"));
  }

  await interaction.editReply({ embeds: [embed] });
}

async function createFlaggedWordsRule(guild, interaction) {
  return await guild.autoModerationRules.create({
    name: `Flagged Words - ${interaction.user.tag} (${interaction.user.id})`,
    creatorId: interaction.client.user.id,
    enabled: true,
    eventType: 1,
    triggerType: 4,
    triggerMetadata: {
      presets: [1, 2, 3],
    },
    actions: [
      {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
        },
      },
    ],
  });
}

async function createSpamMessagesRule(guild, interaction) {
  return await guild.autoModerationRules.create({
    name: `Spam Messages - ${interaction.user.tag} (${interaction.user.id})`,
    creatorId: interaction.client.user.id,
    enabled: true,
    eventType: 1,
    triggerType: 3,
    triggerMetadata: {},
    actions: [
      {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
        },
      },
    ],
  });
}

async function createMentionSpamRule(guild, interaction, options) {
  const amount = options.getInteger("amount");
  return await guild.autoModerationRules.create({
    name: `Mention Spam - ${interaction.user.tag} (${interaction.user.id})`,
    creatorId: interaction.client.user.id,
    enabled: true,
    eventType: 1,
    triggerType: 5,
    triggerMetadata: {
      mentionTotalLimit: amount,
    },
    actions: [
      {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
        },
      },
    ],
  });
}

async function createKeywordRule(guild, interaction, options) {
  const word = options.getString("word");
  return await guild.autoModerationRules.create({
    name: `Keyword - ${interaction.user.tag} (${interaction.user.id})`,
    creatorId: interaction.client.user.id,
    enabled: true,
    eventType: 1,
    triggerType: 1,
    triggerMetadata: {
      keywordFilter: [word],
    },
    actions: [
      {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
        },
      },
    ],
  });
}
