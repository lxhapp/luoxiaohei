import { Events, EmbedBuilder, Collection, Interaction } from "discord.js";
const DEFAULT_COOLDOWN_DURATION = 3;

export const name = Events.InteractionCreate;
export async function execute(interaction: any) {
  if (!interaction?.isChatInputCommand()) return;

  const { client, commandName, user } = interaction;
  const command = client.commands.get(commandName);

  try {
    if (!command) {
      console.error(`No command matching ${commandName} was found`);
      return await sendErrorResponse(interaction, "command_not_found");
    }

    if (!interaction.isRepliable()) {
      console.log("Interaction is no longer valid");
      return await sendErrorResponse(interaction, "interaction_invalid");
    }

    if (await checkBetaAccess(interaction, command)) return;
    if (await checkCooldown(interaction, command)) return;

    console.log(`${user.id} | ${user.tag} ~ ${buildLogMessage(interaction)}`);

    if (command.defer !== false) {
      await interaction.deferReply();
    }

    await executeCommandWithTimeout(interaction, command);
  } catch (error) {
    console.error("Command execution error:", error);
    await handleCommandError(interaction);
    cleanupCooldown(interaction);
  }
}

async function executeCommandWithTimeout(interaction: any, command: any) {
  const commandPromise = command.run({
    interaction,
    client: interaction.client,
  });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Command timeout")), 30000)
  );

  try {
    await Promise.race([commandPromise, timeoutPromise]);
  } catch (error) {
    if (error.message === "Command timeout") {
      await sendErrorResponse(interaction, "timeout");
    }
    throw error;
  }
}

function buildLogMessage(interaction: any) {
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

async function checkBetaAccess(interaction: any, command: any) {
  if (command.beta && interaction.user.id !== "1053012080812359750") {
    if (!interaction.replied && !interaction.deferred) return true;
    const embed = new EmbedBuilder()
      .setColor(interaction.client.embedColor)
      .setDescription(
        interaction.client.getLocale(
          interaction.locale,
          "InteractionCreate.beta"
        )
      );

    await interaction.editReply({ embeds: [embed], ephemeral: true });
    return true;
  }
  return false;
}

async function checkCooldown(interaction: any, command: any) {
  const { cooldowns } = interaction.client;

  if (cooldowns.has(command.data.name)) {
    const timestamps = cooldowns.get(command.data.name);
    const now = Date.now();
    [...timestamps.entries()].forEach(([userId, timestamp]) => {
      const cooldownAmount =
        (command.cooldown ?? DEFAULT_COOLDOWN_DURATION) * 1000;
      if (now > timestamp + cooldownAmount) {
        timestamps.delete(userId);
      }
    });

    if (timestamps.size === 0) {
      cooldowns.delete(command.data.name);
    }
  }

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
        .setColor(interaction.client.embedColor)
        .setDescription(
          interaction.client
            .getLocale(interaction.locale, "InteractionCreate.cooldown")
            .replace("{{command}}", command.data.name)
            .replace("{{time}}", `<t:${expiredTimestamp}:R>`)
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

async function handleCommandError(interaction: any) {
  console.warn("Error executing command: " + interaction.error?.message);
  console.error(interaction.error);

  const embed = new EmbedBuilder()
    .setColor(interaction.client.embedColor)
    .setDescription(
      interaction.client.getLocale(
        interaction.locale,
        "InteractionCreate.error.generic"
      )
    );

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  } else {
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }
}

async function sendErrorResponse(interaction: any, errorType: string) {
  const error = interaction.client.getLocale(
    interaction.locale,
    `InteractionCreate.error.${errorType}`
  );
  const embed = new EmbedBuilder()
    .setColor(interaction.client.embedColor)
    .setDescription(error);

  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ embeds: [embed], ephemeral: true });
  } else {
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }
}

function cleanupCooldown(interaction: any) {
  const { cooldowns } = interaction.client;

  if (cooldowns.has(interaction.commandName)) {
    const timestamps = cooldowns.get(interaction.commandName);
    const now = Date.now();
    [...timestamps.entries()].forEach(([userId, timestamp]) => {
      const cooldownAmount =
        (interaction.client.commands.get(interaction.commandName).cooldown ??
          DEFAULT_COOLDOWN_DURATION) * 1000;
      if (now > timestamp + cooldownAmount) {
        timestamps.delete(userId);
      }
    });

    if (timestamps.size === 0) {
      cooldowns.delete(interaction.commandName);
    }
  }
}
