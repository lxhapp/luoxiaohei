import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";

const AUTOMOD_RULES = {
  "flagged-words": {
    triggerType: 4,
    triggerMetadata: {
      presets: [1, 2, 3],
    },
  },
  "spam-messages": {
    triggerType: 3,
    triggerMetadata: {},
  },
  "mention-spam": {
    triggerType: 5,
    triggerMetadata: (amount: number) => ({
      mentionTotalLimit: amount,
    }),
  },
  keyword: {
    triggerType: 1,
    triggerMetadata: (word: string) => ({
      keywordFilter: [word],
    }),
  },
};

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
            ja: "メンションの制限数",
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
        ja: "指定されたキーワードをブロックする",
      })
      .addStringOption((option) =>
        option
          .setName("word")
          .setDescription("The specified word you want to block")
          .setDescriptionLocalizations({
            ru: "Указанное слово, которое вы хотите заблокировать",
            uk: "Вказане слово, яке потрібно заблокувати",
            ja: "ブロックしたいキーワード",
          })
          .setRequired(true)
      )
  )
  .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
  .setContexts(InteractionContextType.Guild);

export async function run({ interaction, client }) {
  const { guild, options } = interaction;

  // Check bot permissions
  if (!(await checkBotPermissions(guild, interaction, client))) return;

  try {
    const subcommand = options.getSubcommand();
    const rule = await createAutoModRule(guild, interaction, subcommand);

    await sendResponse(
      interaction,
      client,
      rule ? "success" : "errors.alreadyExists"
    );
  } catch (error) {
    console.error("Error creating AutoMod rule:", error);
    await sendResponse(interaction, client, "errors.error");
  }
}

async function checkBotPermissions(guild: any, interaction: any, client: any) {
  if (
    !guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)
  ) {
    await sendResponse(interaction, client, "errors.noPermission");
    return false;
  }
  return true;
}

async function createAutoModRule(
  guild: any,
  interaction: any,
  subcommand: any
) {
  const ruleConfig = AUTOMOD_RULES[subcommand];
  if (!ruleConfig) return null;

  const existingRules = await guild.autoModerationRules.fetch();
  const rulesOfSameType = existingRules.filter(
    (rule: any) => rule.triggerType === ruleConfig.triggerType
  );

  if (subcommand === "mention-spam" && rulesOfSameType.size > 1) {
    await interaction.editReply({
      content: interaction.client.getLocale(
        interaction.locale,
        "automod.errors.maxRulesExceeded"
      ),
      ephemeral: true,
    });
    return null;
  }

  const baseRule = {
    name: `${capitalizeFirstLetter(subcommand)} - ${interaction.user.tag} (${
      interaction.user.id
    })`,
    creatorId: interaction.client.user.id,
    enabled: true,
    eventType: 1,
    triggerType: ruleConfig.triggerType,
    triggerMetadata:
      typeof ruleConfig.triggerMetadata === "function"
        ? ruleConfig.triggerMetadata(getOptionValue(interaction, subcommand))
        : ruleConfig.triggerMetadata,
    actions: [
      {
        type: 1,
        metadata: {
          channel: interaction.channel,
          durationSeconds: 10,
        },
      },
    ],
  };

  return await guild.autoModerationRules.create(baseRule);
}

function getOptionValue(interaction, subcommand) {
  switch (subcommand) {
    case "mention-spam":
      return interaction.options.getInteger("amount");
    case "keyword":
      return interaction.options.getString("word");
    default:
      return null;
  }
}

async function sendResponse(interaction, client, type) {
  const embed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setDescription(client.getLocale(interaction.locale, `automod.${type}`));

  await interaction.editReply({ embeds: [embed] });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
