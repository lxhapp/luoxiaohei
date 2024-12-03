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
    return showLeaderboard(interaction, client);
  }
}

async function showLeaderboard(interaction: any, client: any) {
  const { locale } = interaction;
  const { data: leaderboardData, error } = await supabase
    .from("users")
    .select("user_id, balance, is_anonymous, verified")
    .order("balance", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return interaction.editReply(client.getLocale(locale, "leaderboard.error"));
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return interaction.editReply(
      client.getLocale(locale, "leaderboard.noUsersFound")
    );
  }

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
      ? entry.verified
        ? `${users[index].username} <:verified:1298973121839235143>`
        : users[index].username
      : "?",
  }));

  const embed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setTitle(client.getLocale(locale, "leaderboard.title"))
    .setDescription(client.getLocale(locale, "leaderboard.description"))
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

async function handleToggleAnonymous(interaction: any, client: any) {
  const userId = interaction.user.id;
  const { locale } = interaction;

  let { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("is_anonymous")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code === "PGRST116") {
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert([
        {
          user_id: userId,
          balance: 0,
          is_anonymous: false,
          verified: false,
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return interaction.editReply(
        client.getLocale(locale, "leaderboard.errors.create_user")
      );
    }

    userData = newUser;
  } else if (fetchError) {
    console.error("Error fetching user data:", fetchError);
    return interaction.editReply(
      client.getLocale(locale, "leaderboard.errors.fetch_data")
    );
  }

  const newAnonymousState = !userData.is_anonymous;

  const { error: updateError } = await supabase
    .from("users")
    .update({ is_anonymous: newAnonymousState })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating user data:", updateError);
    return interaction.editReply(
      client.getLocale(locale, "leaderboard.errors.update_data")
    );
  }

  const responseKey = newAnonymousState
    ? "leaderboard.anonymous.enabled"
    : "leaderboard.anonymous.disabled";
  return interaction.editReply(client.getLocale(locale, responseKey));
}
