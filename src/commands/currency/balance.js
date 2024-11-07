import { createClient } from "@supabase/supabase-js";
import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("balance")
  .setDescription("Check their balance (or your own)")
  .setDescriptionLocalizations({
    ru: "Проверьте баланс (или своего)",
    uk: "Перевірте баланс (або свої)",
    ja: "バランスを確認する（または自分の）",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("The user to check the balance of")
      .setDescriptionLocalizations({
        ru: "Пользователь, баланс которого вы хотите проверить",
        uk: "Користувач, баланс якого ви хочете перевірити",
        ja: "バランスを確認する（または自分の）",
      })
      .setRequired(false)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

// In your balance command:
export async function run({ interaction, client }) {
  try {

    const user = interaction.options.getUser("user") || interaction.user;

    // Fetch user balance from Supabase
    let { data: dbUser, error } = await supabase
      .from("users")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user balance:", error);
      if (interaction.isRepliable()) {
        return interaction.editReply(
          client.getLocale(interaction.locale, "balanceError")
        );
      }
      return;
    }

    // If user doesn't exist, create a new entry with 0 balance
    if (!dbUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({ user_id: user.id, balance: 0 })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating new user:", insertError);
        if (interaction.isRepliable()) {
          return interaction.editReply(
            client.getLocale(interaction.locale, "balanceError")
          );
        }
        return;
      }
      dbUser = newUser;
    }

    const balance = dbUser ? dbUser.balance : 0;

    const embed = new EmbedBuilder().setColor("#212226").setDescription(
      client
        .getLocale(
          interaction.locale,
          user.id === interaction.user.id ? "viewSelfBalance" : "viewBalance"
        )
        .replace("{user}", `<@${user.id}>`)
        .replace("{balance}", balance.toString())
    );

    if (interaction.isRepliable()) {
      await interaction
        .editReply({
          embeds: [embed],
          allowedMentions: { repliedUser: false, users: [user.id] },
        })
        .catch((err) => {
          console.error("Failed to edit reply:", err);
        });
    }
  } catch (error) {
    console.error("Balance command error:", error);
    if (interaction.isRepliable()) {
      try {
        await interaction.editReply(
          client.getLocale(interaction.locale, "balanceError")
        );
      } catch (err) {
        console.error("Failed to send error message:", err);
      }
    }
  }
}

// In your InteractionCreate.js:
async function handleCommandError(interaction, error, locale) {
  console.warn(`Error executing command: ${error.message}`);
  console.error(error);

  const embed = new EmbedBuilder()
    .setColor(DEFAULT_COLOR)
    .setDescription(interaction.client.getLocale(locale, "interr"));

  try {
    if (!interaction.isRepliable()) {
      console.log("Interaction is no longer valid for error handling");
      return;
    }

    if (interaction.deferred) {
      await interaction
        .editReply({ embeds: [embed], ephemeral: true })
        .catch((err) => console.error("Failed to edit reply with error:", err));
    } else if (!interaction.replied) {
      await interaction
        .reply({ embeds: [embed], ephemeral: true })
        .catch((err) => console.error("Failed to send error reply:", err));
    } else {
      await interaction
        .followUp({ embeds: [embed], ephemeral: true })
        .catch((err) => console.error("Failed to follow up with error:", err));
    }
  } catch (followUpError) {
    console.error("Error sending error message:", followUpError);
  }
}

export async function execute(interaction) {
  if (!interaction || !interaction.isChatInputCommand()) return;

  try {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found`);
      return;
    }

    const { locale } = interaction;

    if (await checkBetaAccess(interaction, command, locale)) return;
    if (await checkCooldown(interaction, command, locale)) return;

    const logMessage = buildLogMessage(interaction);
    console.log(
      `${interaction.user.id} | ${interaction.user.tag} ~ ${logMessage}`
    );

    // Add timeout handling
    const timeoutDuration = 15000; // 15 seconds
    const commandPromise = command.run({
      interaction,
      client: interaction.client,
    });

    try {
      await Promise.race([
        commandPromise,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Command timeout")),
            timeoutDuration
          )
        ),
      ]);
    } catch (error) {
      if (error.message === "Command timeout") {
        console.error("Command timed out");
        if (interaction.isRepliable()) {
          try {
            const embed = new EmbedBuilder()
              .setColor(DEFAULT_COLOR)
              .setDescription(
                interaction.client.getLocale(locale, "commandTimeout")
              );

            if (interaction.deferred) {
              await interaction.editReply({ embeds: [embed], ephemeral: true });
            } else if (!interaction.replied) {
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
          } catch (err) {
            console.error("Failed to send timeout message:", err);
          }
        }
      }
      throw error;
    }
  } catch (error) {
    await handleCommandError(interaction, error, interaction.locale);
  }
}