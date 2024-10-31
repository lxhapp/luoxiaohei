import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 60;
export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Who is the richest?")
  .setDescriptionLocalizations({
    ru: "Кто самый богатый?",
    uk: "Хто найбільш багатий?",
    ja: "最も裕福なのは誰ですか？",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1])
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("Show the leaderboard")
      .setDescriptionLocalizations({
        ru: "Показать таблицу лидеров",
        uk: "Показати таблицю лідерів",
        ja: "リーダーボードを表示する",
      })
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("anonymous")
      .setDescription("Toggle your visibility on the leaderboard")
      .setDescriptionLocalizations({
        ru: "Переключить вашу видимость в таблице лидеров",
        uk: "Перемкнути вашу видимість у таблиці лідерів",
        ja: "リーダーボードでの表示を切り替える",
      })
  );

export async function run({ interaction, client }) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === "anonymous") {
    return handleToggleAnonymous(interaction, client);
  } else {
    // Default to showing the leaderboard for 'list' or if no subcommand is specified
    return showLeaderboard(interaction, client);
  }
}

async function showLeaderboard(interaction, client) {
  await interaction.deferReply();

  // Fetch top 10 users from Supabase, excluding those with 0 balance
  const { data: leaderboardData, error } = await supabase
    .from("users")
    .select("user_id, balance, is_anonymous")
    .gt("balance", 0) // This line filters out users with 0 or less balance
    .order("balance", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return interaction.editReply(
      client.getLocale(interaction.locale, "ldError")
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "ldNoUsersFound")
    );
  }

  // Fetch user data for valid entries
  const userPromises = leaderboardData.map((entry) =>
    client.users.fetch(entry.user_id).catch(() => null)
  );
  const users = await Promise.all(userPromises);

  const formattedLeaderboard = leaderboardData.map((entry, index) => ({
    position: index + 1,
    id: entry.user_id,
    balance: entry.balance,
    name: entry.is_anonymous
      ? ":detective: Anonymous"
      : users[index]
      ? users[index].username
      : "?",
  }));

  const embed = new EmbedBuilder()
    .setColor("#212226")
    .setTitle(client.getLocale(interaction.locale, "ldTitle"))
    .setDescription(client.getLocale(interaction.locale, "ldDescription"))
    .addFields(
      formattedLeaderboard.map((user) => ({
        name: `#${user.position} - ${user.name}`,
        value: `${user.balance}¥`,
        inline: false,
      }))
    )
    .setTimestamp();

  return interaction.editReply({ embeds: [embed] });
}

async function handleToggleAnonymous(interaction, client) {
  await interaction.deferReply({ ephemeral: true });

  const userId = interaction.user.id;

  // Fetch current user data
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("is_anonymous")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user data:", fetchError);
    return interaction.editReply(
      client.getLocale(interaction.locale, "errorFetchingUserData")
    );
  }

  const newAnonymousState = !userData.is_anonymous;

  // Update user's anonymous state
  const { error: updateError } = await supabase
    .from("users")
    .update({ is_anonymous: newAnonymousState })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating user data:", updateError);
    return interaction.editReply(
      client.getLocale(interaction.locale, "errorUpdatingUserData")
    );
  }

  const responseKey = newAnonymousState
    ? "anonymousEnabled"
    : "anonymousDisabled";
  return interaction.editReply(
    client.getLocale(interaction.locale, responseKey)
  );
}
