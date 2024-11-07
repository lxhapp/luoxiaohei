import { Events, EmbedBuilder, Collection } from "discord.js";

const DEFAULT_COLOR = "#212226";
const DEFAULT_COOLDOWN_DURATION = 3;

export const name = Events.InteractionCreate;
export async function execute(interaction) {
  if (!interaction || !interaction.isChatInputCommand()) return;

  try {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found`);
      return;
    }

    if (!interaction.isRepliable()) {
      console.log("Interaction is no longer valid");
      return;
    }

    const { locale } = interaction;

    if (await checkBetaAccess(interaction, command, locale)) return;
    if (await checkCooldown(interaction, command, locale)) return;

    const logMessage = buildLogMessage(interaction);
    console.log(
      `${interaction.user.id} | ${interaction.user.tag} ~ ${logMessage}`
    );

    await interaction.deferReply().catch((err) => {
      console.error("Failed to defer reply:", err);
      return;
    });

    // Add timeout to prevent hanging
    const commandPromise = command.run({
      interaction,
      client: interaction.client,
    });
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Command timeout")), 30000)
    );

    await Promise.race([commandPromise, timeoutPromise]);
  } catch (error) {
    console.error("Command execution error:", error);
    try {
      await handleCommandError(interaction, error, interaction.locale);
    } catch (followUpError) {
      console.error("Error sending error message:", followUpError);
    }

    // Clean up cooldown on error
    const timestamps = interaction.client.cooldowns.get(
      interaction.commandName
    );
    if (timestamps) {
      timestamps.delete(interaction.user.id);
    }
  }
}

function buildLogMessage(interaction) {
  const { commandName, options } = interaction;
  let message = `/${commandName}`;

  const subcommandGroup = options.getSubcommandGroup(false);
  const subcommand = options.getSubcommand(false);

  if (subcommandGroup) {
    message += ` ${subcommandGroup}`;
  }
  if (subcommand) {
    message += ` ${subcommand}`;
  }

  if (!subcommand && !subcommandGroup) {
    const optionsString = options.data
      .map((option) => {
        let value = option.value;
        if (option.type === 3) value = `"${value}"`;
        if (option.type === 4 || option.type === 10) value = value.toString();
        if (option.type === 5) value = value ? "true" : "false";
        if (option.type === 1 || option.type === 2) return "";

        return `${option.name}: ${value}`;
      })
      .filter(Boolean)
      .join(" ");

    if (optionsString) {
      message += ` ${optionsString}`;
    }
  }

  return message;
}

async function checkBetaAccess(interaction, command, locale) {
  if (command.beta && interaction.user.id !== "1053012080812359750") {
    if (!interaction.replied && !interaction.deferred) return true;
    const embed = new EmbedBuilder()
      .setColor(DEFAULT_COLOR)
      .setDescription(interaction.client.getLocale(locale, "beta"));

    await interaction.editReply({ embeds: [embed], ephemeral: true });
    return true;
  }
  return false;
}

async function checkCooldown(interaction, command, locale) {
  const { cooldowns } = interaction.client;

  // Clean up expired cooldowns first
  if (cooldowns.has(command.data.name)) {
    const timestamps = cooldowns.get(command.data.name);
    const now = Date.now();
    // Clean up any expired entries
    [...timestamps.entries()].forEach(([userId, timestamp]) => {
      const cooldownAmount =
        (command.cooldown ?? DEFAULT_COOLDOWN_DURATION) * 1000;
      if (now > timestamp + cooldownAmount) {
        timestamps.delete(userId);
      }
    });

    // If map is empty after cleanup, delete it
    if (timestamps.size === 0) {
      cooldowns.delete(command.data.name);
    }
  }

  // Initialize cooldown collection if needed
  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const cooldownAmount = (command.cooldown ?? DEFAULT_COOLDOWN_DURATION) * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      const embed = new EmbedBuilder()
        .setColor(DEFAULT_COLOR)
        .setDescription(
          interaction.client
            .getLocale(locale, "cooldown")
            .replace("${command.data.name}", command.data.name)
            .replace("<t:${expiredTimestamp}:R>", `<t:${expiredTimestamp}:R>`)
        );

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      }
      return true;
    }
  }

  timestamps.set(interaction.user.id, now);
  return false;
}

async function handleCommandError(interaction, error, locale) {
  console.warn(`Error executing command: ${error.message}`);
  console.error(error);

  const embed = new EmbedBuilder()
    .setColor(DEFAULT_COLOR)
    .setDescription(interaction.client.getLocale(locale, "interr"));

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  } else {
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }
}
