import { SlashCommandBuilder } from "discord.js";
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
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "gameApp"));
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  if (user === interaction.user) {
    const embed = new EmbedBuilder()
      .setColor("#212226")
      .setDescription(client.getLocale(locale, "gameYS"));
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
      title: client.getLocale(locale, "tttTitle"),
      color: `#212226`,
      statusTitle: client.getLocale(locale, "tttStatus"),
      overTitle: client.getLocale(locale, "tttGOver"),
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
    turnMessage: client.getLocale(locale, "tttTurn"),
    winMessage: client.getLocale(locale, "tttWin"),
    tieMessage: client.getLocale(locale, "gameTie"),
    timeoutMessage: client.getLocale(locale, "tttTimeout"),
    playerOnlyMessage: client.getLocale(locale, "gameOnPOnly"),
  });

  game.startGame();
}
