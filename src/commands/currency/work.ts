import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} from "discord.js";

const WEATHER_EFFECTS = {
  sunny: { catchBonus: 0.05, emoji: "☀️" },
  rainy: { catchBonus: 0.1, emoji: "🌧️" },
  stormy: { catchBonus: -0.03, emoji: "⛈️" },
  perfect: { catchBonus: 0.15, emoji: "🌈" },
};

const LOCATIONS = {
  pond: {
    fish: ["🐟", "🐠", "🐡"],
    baseChanceBonus: 0,
    emoji: "🏊",
  },
  river: {
    fish: ["🐟", "🐠", "🐳", "🦈"],
    baseChanceBonus: 0.02,
    emoji: "🌊",
  },
  ocean: {
    fish: ["🐋", "🐳", "🦈", "🐡"],
    baseChanceBonus: 0.05,
    emoji: "🌊",
  },
};

const RARE_FISH = {
  "🐉": { chance: 0.01, reward: 50 },
  "🦄": { chance: 0.02, reward: 30 },
  "✨": { chance: 0.05, reward: 20 },
};

const difficultySettings = {
  easy: {
    requiredFish: 9,
    catchChance: 0.4,
    multiplier: 1,
    cooldown: 2000,
  },
  medium: {
    requiredFish: 13,
    catchChance: 0.25,
    multiplier: 2,
    cooldown: 1500,
  },
  hard: {
    requiredFish: 17,
    catchChance: 0.15,
    multiplier: 3,
    cooldown: 1000,
  },
  extreme: {
    requiredFish: 22,
    catchChance: 0.08,
    multiplier: 5,
    cooldown: 800,
  },
};

export const beta = false;
export const cooldown = 300;
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

function getCurrentWeather(): keyof typeof WEATHER_EFFECTS {
  const weathers = Object.keys(WEATHER_EFFECTS);
  return weathers[
    Math.floor(Math.random() * weathers.length)
  ] as keyof typeof WEATHER_EFFECTS;
}

function getRandomLocation(): keyof typeof LOCATIONS {
  const locations = Object.keys(LOCATIONS);
  return locations[
    Math.floor(Math.random() * locations.length)
  ] as keyof typeof LOCATIONS;
}

export async function run({ interaction, client }) {
  const { locale, user } = interaction;
  const difficulty = interaction.options.getString("difficulty");
  const settings = difficultySettings[difficulty];

  let fishCaught = 0;
  let streak = 0;
  let lastCatch = 0;
  let totalBonus = 0;

  const weather = getCurrentWeather();
  const location = getRandomLocation();
  const isGoldenHour = Math.random() < 0.1;

  const button = new ButtonBuilder()
    .setCustomId("fish_button")
    .setLabel(client.getLocale(locale, "work.fish.cast"))
    .setEmoji("🎣")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
  const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    ButtonBuilder.from(button).setDisabled(true)
  );

  const progressEmbed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(client.getLocale(locale, "work.fish.title"))
    .setDescription(
      `${WEATHER_EFFECTS[weather].emoji} ${LOCATIONS[location].emoji} ${
        isGoldenHour ? "✨ " : ""
      }${client
        .getLocale(locale, "work.fish.start")
        .replace(
          "{{weather}}",
          client.getLocale(locale, `work.fish.weather.${weather}`)
        )
        .replace(
          "{{location}}",
          client.getLocale(locale, `work.fish.location.${location}`)
        )}`
    )
    .addFields(
      {
        name: client.getLocale(locale, "work.fish.progress"),
        value: `${fishCaught}/${settings.requiredFish}`,
        inline: true,
      },
      {
        name: client.getLocale(locale, "work.fish.streak"),
        value: streak.toString(),
        inline: true,
      }
    )
    .setTimestamp();

  const message = await interaction.editReply({
    embeds: [progressEmbed],
    components: [row],
  });

  const collector = message.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 180000,
  });

  collector.on(
    "collect",
    async (i: {
      user: { id: any };
      update: (arg0: {
        embeds: EmbedBuilder[];
        components: ActionRowBuilder<ButtonBuilder>[];
      }) => any;
    }) => {
      if (i.user.id !== user.id) return;
      if (collector.ended) return;

      if (Date.now() - collector.createdTimestamp >= 30000) {
        await i.update({
          embeds: [progressEmbed],
          components: [disabledRow],
        });
        return;
      }

      const now = Date.now();
      if (now - lastCatch < settings.cooldown) {
        const cooldownButton = ButtonBuilder.from(button).setDisabled(true);
        const cooldownRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          cooldownButton
        );

        await i.update({ embeds: [progressEmbed], components: [cooldownRow] });

        setTimeout(async () => {
          await interaction.editReply({
            embeds: [progressEmbed],
            components: [row],
          });
        }, settings.cooldown);

        return;
      }

      lastCatch = now;
      let catchChance = settings.catchChance;
      catchChance += WEATHER_EFFECTS[weather].catchBonus;
      catchChance += LOCATIONS[location].baseChanceBonus;
      if (isGoldenHour) catchChance += 0.1;
      catchChance += streak * 0.01;

      if (Math.random() < catchChance) {
        fishCaught++;
        streak++;

        let caughtFish = "";
        let bonusReward = 0;

        for (const [fish, data] of Object.entries(RARE_FISH)) {
          if (Math.random() < data.chance) {
            caughtFish = fish;
            bonusReward = data.reward;
            break;
          }
        }

        if (!caughtFish) {
          const locationFish = LOCATIONS[location].fish;
          caughtFish =
            locationFish[Math.floor(Math.random() * locationFish.length)];
        }

        totalBonus += bonusReward;

        progressEmbed
          .setDescription(
            `${WEATHER_EFFECTS[weather].emoji} ${LOCATIONS[location].emoji} ${
              isGoldenHour ? "✨ " : ""
            }${client
              .getLocale(locale, "work.fish.caught")
              .replace("{{fish}}", caughtFish)}`
          )
          .setFields(
            {
              name: client.getLocale(locale, "work.fish.progress"),
              value: `${fishCaught}/${settings.requiredFish}`,
              inline: true,
            },
            {
              name: client.getLocale(locale, "work.fish.streak"),
              value: streak.toString(),
              inline: true,
            }
          );
      } else {
        streak = 0;
        progressEmbed
          .setDescription(
            client
              .getLocale(locale, "work.fish.missed")
              .replace("{{fish}}", "🐟")
          )
          .setFields(
            {
              name: client.getLocale(locale, "work.fish.progress"),
              value: `${fishCaught}/${settings.requiredFish}`,
              inline: true,
            },
            {
              name: client.getLocale(locale, "work.fish.streak"),
              value: streak.toString(),
              inline: true,
            }
          );
      }

      if (fishCaught >= settings.requiredFish) {
        await i.update({ embeds: [progressEmbed], components: [] });
        collector.stop("success");
        return;
      }

      await i.update({ embeds: [progressEmbed], components: [row] });
    }
  );

  collector.on("end", async (collected: any, reason: string) => {
    if (reason === "success") {
      const baseReward = Math.floor(Math.random() * 10) + 5;
      const streakBonus = Math.floor(streak * 0.5);
      const weatherBonus = Math.floor(
        WEATHER_EFFECTS[weather].catchBonus * 100
      );
      const goldenHourBonus = isGoldenHour ? 5 : 0;
      const finalReward =
        baseReward * settings.multiplier +
        streakBonus +
        weatherBonus +
        goldenHourBonus +
        totalBonus;

      await client.addBalance(user.id, finalReward);

      const successEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTitle(client.getLocale(locale, "work.fish.success"))
        .setDescription(
          client
            .getLocale(locale, "work.fish.reward")
            .replace("{{amount}}", finalReward.toString())
        )
        .addFields(
          {
            name: client.getLocale(locale, "work.fish.bonus.streak"),
            value: `${streakBonus}`,
            inline: true,
          },
          {
            name: client.getLocale(locale, "work.fish.bonus.weather"),
            value: `${weatherBonus}`,
            inline: true,
          },
          {
            name: client.getLocale(locale, "work.fish.bonus.golden"),
            value: `${goldenHourBonus}`,
            inline: true,
          }
        )
        .setTimestamp();

      await interaction
        .editReply({
          embeds: [successEmbed],
          components: [],
        })
        .catch(() => {});
    } else {
      const timeoutEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setTitle(client.getLocale(locale, "work.fish.timeout_title"))
        .setDescription(client.getLocale(locale, "work.fish.timeout"))
        .setTimestamp();

      await interaction
        .editReply({
          embeds: [timeoutEmbed],
          components: [],
        })
        .catch(() => {});
    }
  });
}
