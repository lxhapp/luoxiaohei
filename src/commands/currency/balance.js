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

export async function run({ interaction, client }) {
  const { locale } = interaction;
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
        return interaction.editReply(client.getLocale(locale, "balance.error"));
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
            client.getLocale(locale, "balance.error")
          );
        }
        return;
      }
      dbUser = newUser;
    }

    const balance = dbUser ? dbUser.balance : 0;

    const embed = new EmbedBuilder().setColor(client.embedColor).setDescription(
      client
        .getLocale(
          locale,
          user.id === interaction.user.id ? "balance.selfview" : "balance.view"
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
        await interaction.editReply(client.getLocale(locale, "balance.error"));
      } catch (err) {
        console.error("Failed to send error message:", err);
      }
    }
  }
}
