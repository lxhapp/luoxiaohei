import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import axios, { AxiosError } from "axios";

function correctDate(number: number) {
  return number < 10 ? `0${number}` : number;
}

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("wordle")
  .setDescription("Please choose subcommands")
  .setDescriptionLocalizations({
    ru: "Пожалуйста, выберите подкоманды",
    uk: "Будь ласка, оберіть підкоманди",
    ja: "サブコマンドを選択してください",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("answer")
      .setDescription("Get current Wordle answer from The New York Times")
      .setDescriptionLocalizations({
        ru: "Получите актуальный ответ Wordle от The New York Times",
        uk: "Отримайте поточну відповідь Wordle від The New York Times",
        ja: "The New York Timesから現在のWordleの答えを取得する",
      })
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("future")
      .setDescription("Get future Wordle answer from The New York Times")
      .setDescriptionLocalizations({
        ru: "Получите будущий ответ Wordle от The New York Times",
        uk: "Отримайте майбутню відповідь Wordle від The New York Times",
        ja: "The New York Timesから将来のWordleの答えを取得する",
      })
      .addIntegerOption((option) =>
        option
          .setName("day")
          .setDescription("Specify a day from selected Wordle answer")
          .setDescriptionLocalizations({
            ru: "Укажите день из выбранного ответа Wordle",
            uk: "Вкажіть день з обраної відповіді Wordle",
            ja: "選択されたWordleの答えから日付を指定します",
          })
          .setMaxValue(31)
          .setMinValue(1)
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("month")
          .setDescription("Specify a month from selected Wordle answer")
          .setDescriptionLocalizations({
            ru: "Укажите месяц из выбранного ответа Wordle",
            uk: "Вкажіть місяц з обраної відповіді Wordle",
            ja: "選択されたWordleの答えから月を指定します",
          })
          .setMaxValue(12)
          .setMinValue(1)
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("year")
          .setDescription("Specify a year from selected Wordle answer")
          .setDescriptionLocalizations({
            ru: "Укажите год из выбранного ответа Wordle",
            uk: "Вкажіть рік з обраної відповіді Wordle",
            ja: "選択されたWordleの答えから年を指定します",
          })
          .setMaxValue(2025)
          .setMinValue(2021)
          .setRequired(true)
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  const { locale } = interaction;
  if (interaction.options.getSubcommand() === "answer") {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    try {
      const response = await axios.get(
        `https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`
      );
      const data = response.data;
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({ name: `ID ${data.id}` })
        .addFields({
          name: client.getLocale(locale, "wordle.solution"),
          value: `${data.solution}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "wordle.printdate"),
          value: `${data.print_date}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "wordle.dayssincelaunch"),
          value: `${data.days_since_launch}`.replace("undefined", "**-**"),
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "wordle.editor"),
          value: `${data.editor}`.replace("undefined", "**-**"),
          inline: true,
        });
      interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status || 500;
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          client
            .getLocale(locale, "wordle.err")
            .replace("{code}", `${statusCode}`)
        )
        .setImage(`https://http.cat/${statusCode}.jpg`);
      interaction.editReply({
        embeds: [embed],
      });
    }
  } else if (interaction.options.getSubcommand() === "future") {
    const year = interaction.options.getInteger("year");
    const month = correctDate(interaction.options.getInteger("month"));
    const day = correctDate(interaction.options.getInteger("day"));
    try {
      const response = await axios.get(
        `https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`
      );
      const data = response.data;
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setAuthor({ name: `ID ${data.id}` })
        .addFields({
          name: client.getLocale(locale, "wordle.solution"),
          value: `${data.solution}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "wordle.printdate"),
          value: `${data.print_date}`,
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "wordle.dayssincelaunch"),
          value: `${data.days_since_launch}`.replace("undefined", "**-**"),
          inline: true,
        })
        .addFields({
          name: client.getLocale(locale, "wordle.editor"),
          value: `${data.editor}`.replace("undefined", "**-**"),
          inline: true,
        });
      interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const statusCode = axiosError.response?.status || 500;
      const embed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(
          client
            .getLocale(locale, "wordle.err")
            .replace("{code}", `${statusCode}`)
        )
        .setImage(`https://http.cat/${statusCode}.jpg`);
      interaction.editReply({
        embeds: [embed],
      });
    }
  }
}
