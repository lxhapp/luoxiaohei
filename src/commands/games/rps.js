import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { RockPaperScissors } from "discord-gamecord";

export const beta = false;
export const cooldown = 11;
export const data = new SlashCommandBuilder()
  .setName("rps")
  .setDescription("Play Rock Paper Scissors with someone")
  .setDescriptionLocalizations({
    ru: "Поиграйте с кем-нибудь в Камень-ножницы-бумага",
    uk: "Пограйте з кимось у камінь папір ножиці",
    ja: "誰かとジャンケンをする",
  })
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("Specify a user for game")
      .setDescriptionLocalizations({
        ru: "Укажите пользователя для игры",
        uk: "Вкажіть користувача для гри",
        ja: "誰かとジャンケンをする",
      })
      .setRequired(true)
  );
export async function run({ interaction, client }) {
  const { options, locale } = interaction;
  const user = options.getUser("user");
  if (user.bot) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "gameApp"));
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  if (user === interaction.user) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "gameYS"));
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }
  const game = new RockPaperScissors({
    message: interaction,
    isSlashGame: true,
    opponent: user,
    embed: {
      title: client.getLocale(locale, "rps"),
      color: `#212226`,
      description: client.getLocale(locale, "rpsDesc"),
    },
    buttons: {
      rock: client.getLocale(locale, "rpsR"),
      paper: client.getLocale(locale, "rpsP"),
      scissors: client.getLocale(locale, "rpsS"),
    },
    emojis: {
      rock: `🪨`,
      paper: `📃`,
      scissors: `✂️`,
    },
    mentionUser: false,
    timeoutTime: 60000,
    buttonStyle: `PRIMARY`,
    pickMessage: client.getLocale(locale, "rpsPick"),
    winMessage: client.getLocale(locale, "rpsWin"),
    tieMessage: client.getLocale(locale, "gameTie"),
    timeoutMessage: client.getLocale(locale, "rps"),
    playerOnlyMessage: client.getLocale(locale, "gameOnPOnly"),
  });

  game.startGame();
}
