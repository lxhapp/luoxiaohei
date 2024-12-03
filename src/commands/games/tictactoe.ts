import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { TicTacToe } from "discord-gamecord";

export const beta = false;
export const cooldown = 15;
export const data = new SlashCommandBuilder()
  .setName("tictactoe")
  .setDescription("Play Tic Tac Toe with someone")
  .setDescriptionLocalizations({
    ru: "Поиграйте с кем-нибудь в Крестики-нолики",
    uk: "Пограйте з кимось у хрестики-нулики",
    ja: "誰かとゲームをする",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Specify a user for game")
      .setDescriptionLocalizations({
        ru: "Укажите пользователя для игры",
        uk: "Вкажіть користувача для гри",
        ja: "誰かとゲームをする",
      })
      .setRequired(true)
  );
export async function run({ interaction, client }) {
  const { options, locale } = interaction;
  const user = options.getUser("user");
  if (user.bot) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "tictactoe.gameApp"));
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  if (user === interaction.user) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "tictactoe.sameUser"));
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  const game = new TicTacToe({
    message: interaction,
    isSlashGame: true,
    opponent: user,
    embed: {
      title: client.getLocale(locale, "tictactoe.title"),
      color: client.embedColor,
      statusTitle: client.getLocale(locale, "tictactoe.status"),
      overTitle: client.getLocale(locale, "tictactoe.over"),
    },
    emojis: {
      xButton: `❌`,
      oButton: `🔵`,
      blankButton: `➖`,
    },
    mentionUser: false,
    timeoutTime: 60000,
    xButtonStyle: `SUCCESS`,
    oButtonStyle: `SUCCESS`,
    turnMessage: client.getLocale(locale, "tictactoe.turn"),
    winMessage: client.getLocale(locale, "tictactoe.win"),
    tieMessage: client.getLocale(locale, "tictactoe.tie"),
    timeoutMessage: client.getLocale(locale, "tictactoe.timeout"),
    playerOnlyMessage: client.getLocale(locale, "tictactoe.onPOnly"),
  });

  game.startGame();
}
