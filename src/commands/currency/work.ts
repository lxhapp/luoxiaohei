import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";

export const beta = false;
export const cooldown = 60;
export const data = new SlashCommandBuilder()
  .setName("work")
  .setDescription("Work to earn some yen")
  .setDescriptionLocalizations({
    ru: "Работайте, чтобы заработать йены",
    uk: "Працюйте, щоб заробити єни",
    ja: "働いて円を稼ぐ",
  })
  .addStringOption((option) =>
    option
      .setName("difficulty")
      .setDescription("Choose your fishing difficulty")
      .setDescriptionLocalizations({
        ru: "Выберите сложность вашей рыбалки",
        uk: "Виберіть складність вашої рибалки",
        ja: "釣りの難易度を選択してください",
      })
      .setRequired(true)
      .addChoices(
        { name: "Easy (1x reward)", value: "easy" },
        { name: "Medium (2x reward)", value: "medium" },
        { name: "Hard (3x reward)", value: "hard" },
        { name: "Extreme (5x reward)", value: "extreme" }
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

const difficultySettings = {
  easy: {
    requiredFish: 8,
    catchChance: 0.4,
    multiplier: 1,
    cooldown: 2000,
  },
  medium: {
    requiredFish: 12,
    catchChance: 0.25,
    multiplier: 2,
    cooldown: 1500,
  },
  hard: {
    requiredFish: 15,
    catchChance: 0.15,
    multiplier: 3,
    cooldown: 1000,
  },
  extreme: {
    requiredFish: 20,
    catchChance: 0.08,
    multiplier: 5,
    cooldown: 800,
  },
};

const fishEmojis = ["🐟", "🐠", "🐡", "🦈", "🐋", "🐳"];

export async function run({ interaction, client }) {
  const { locale, user } = interaction;
  const difficulty = interaction.options.getString("difficulty");
  let fishCaught = 0;
  const settings = difficultySettings[difficulty];
  const requiredFish = settings.requiredFish;

  const button = new ButtonBuilder()
    .setCustomId("fish_button")
    .setLabel(client.getLocale(locale, "work.fish.cast"))
    .setEmoji("🎣")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  const progressEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(client.getLocale(locale, "work.fish.title"))
    .setDescription(
      client
        .getLocale(locale, "work.fish.start")
        .replace("{{caught}}", fishCaught.toString())
        .replace("{{required}}", requiredFish.toString())
    )
    .addFields({
      name: client.getLocale(locale, "work.fish.difficulty"),
      value: difficulty.toUpperCase(),
      inline: true,
    })
    .setFooter({ text: client.getLocale(locale, "work.fish.footer") })
    .setTimestamp();

  const response = await interaction.editReply({
    embeds: [progressEmbed],
    components: [row],
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 120000,
  });

  let lastCatch = 0;

  collector.on("collect", async (i) => {
    if (i.user.id !== user.id) return;

    const now = Date.now();
    if (now - lastCatch < settings.cooldown) {
      progressEmbed.setDescription(
        client.getLocale(locale, "work.fish.too_fast")
      );
      await i.update({ embeds: [progressEmbed], components: [row] });
      return;
    }

    lastCatch = now;
    const catchChance = Math.random();

    if (catchChance < settings.catchChance) {
      fishCaught++;
      const randomFish =
        fishEmojis[Math.floor(Math.random() * fishEmojis.length)];

      progressEmbed
        .setDescription(
          client
            .getLocale(locale, "work.fish.caught")
            .replace("{{fish}}", randomFish)
        )
        .setFields({
          name: client.getLocale(locale, "work.fish.progress"),
          value: `${fishCaught}/${requiredFish}`,
          inline: true,
        });
    } else {
      progressEmbed.setDescription(
        client.getLocale(locale, "work.fish.missed")
      );
    }

    await i.update({
      embeds: [progressEmbed],
      components: [row],
    });

    if (fishCaught >= requiredFish) {
      collector.stop("success");
    }
  });

  collector.on("end", async (collected: any, reason: string) => {
    if (reason === "success") {
      const baseReward = Math.floor(Math.random() * 10) + 5;
      const finalReward = baseReward * settings.multiplier;
      await client.addBalance(user.id, finalReward);

      const successEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTitle(client.getLocale(locale, "work.fish.success"))
        .setDescription(
          client
            .getLocale(locale, "work.fish.reward")
            .replace("{{amount}}", finalReward.toString())
        )
        .setTimestamp();

      await interaction.editReply({
        embeds: [successEmbed],
        components: [],
      });
    } else {
      const timeoutEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTitle(client.getLocale(locale, "work.fish.timeout_title"))
        .setDescription(client.getLocale(locale, "work.fish.timeout"))
        .setTimestamp();

      await interaction.editReply({
        embeds: [timeoutEmbed],
        components: [],
      });
    }
  });
}
