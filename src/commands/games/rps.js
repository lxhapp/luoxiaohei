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
      .setDescription(client.getLocale(locale, "rps.gameApp"));
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
    return;
  }

  if (user === interaction.user) {
    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "rps.sameUser"));
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
      title: client.getLocale(locale, "rps.title"),
      color: client.embedColor,
      description: client.getLocale(locale, "rps.description"),
    },
    buttons: {
      rock: client.getLocale(locale, "rps.rock"),
      paper: client.getLocale(locale, "rps.paper"),
      scissors: client.getLocale(locale, "rps.scissors"),
    },
    emojis: {
      rock: `🪨`,
      paper: `📃`,
      scissors: `✂️`,
    },
    mentionUser: false,
    timeoutTime: 60000,
    buttonStyle: `PRIMARY`,
    pickMessage: client.getLocale(locale, "rps.pick"),
    winMessage: client.getLocale(locale, "rps.win"),
    tieMessage: client.getLocale(locale, "rps.tie"),
    timeoutMessage: client.getLocale(locale, "rps.timeout"),
    playerOnlyMessage: client.getLocale(locale, "rps.onPOnly"),
  });

  game.startGame();
}
