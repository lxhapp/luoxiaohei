import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";

export const beta = false;
export const defer = false;
export const cooldown = 120;
export const data = new SlashCommandBuilder()
  .setName("work")
  .setDescription("Work to earn some yen")
  .setDescriptionLocalizations({
    ru: "Работайте, чтобы заработать йены",
    uk: "Працюйте, щоб заробити єни",
    ja: "働いて円を稼ぐ",
  })
  .addStringOption((option) =>
    option
      .setName("difficulty")
      .setDescription("Choose your work difficulty")
      .setRequired(true)
      .addChoices(
        { name: "Easy", value: "easy" },
        { name: "Medium", value: "medium" },
        { name: "Hard", value: "hard" },
        { name: "Extreme", value: "extreme" }
      )
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

function generateMathProblem(difficulty: string): {
  question: string;
  answer: number;
} {
  let num1: number, num2: number, operator: string;

  switch (difficulty) {
    case "easy":
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
      break;
    case "medium":
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
      if (operator === "/") {
        num1 = num2 * (Math.floor(Math.random() * 10) + 1);
      }
      break;
    case "hard":
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * 50) + 20;
      operator = ["+", "-", "*", "/", "%"][Math.floor(Math.random() * 5)];
      if (operator === "/") {
        num1 = num2 * (Math.floor(Math.random() * 20) + 1);
      }
      break;
    case "extreme":
      num1 = Math.floor(Math.random() * 100) + 50;
      num2 = Math.floor(Math.random() * 100) + 50;
      operator = ["+", "-", "*", "/", "%", "**"][Math.floor(Math.random() * 6)];
      if (operator === "/") {
        num1 = num2 * (Math.floor(Math.random() * 30) + 1);
      }
      if (operator === "**") {
        num2 = Math.floor(Math.random() * 3) + 2;
      }
      break;
    default:
      num1 = 1;
      num2 = 1;
      operator = "+";
  }

  let answer: number;
  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      break;
    case "*":
      answer = num1 * num2;
      break;
    case "/":
      answer = num1 / num2;
      break;
    case "%":
      answer = num1 % num2;
      break;
    case "**":
      answer = Math.pow(num1, num2);
      break;
    default:
      answer = 0;
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer,
  };
}

function getReward(difficulty: string): number {
  const rewards = {
    easy: { min: 1, max: 5 },
    medium: { min: 5, max: 15 },
    hard: { min: 15, max: 30 },
    extreme: { min: 30, max: 100 },
  };

  const { min, max } = rewards[difficulty];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const difficulty = interaction.options.getString("difficulty");
  const problem = generateMathProblem(difficulty);

  const modal = new ModalBuilder()
    .setCustomId(`math_${difficulty}_${problem.answer}`)
    .setTitle(client.getLocale(locale, "work.modal_title"));

  const answerInput = new TextInputBuilder()
    .setCustomId("answer")
    .setLabel(problem.question)
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    answerInput
  );
  modal.addComponents(actionRow);

  await interaction.showModal(modal);

  const modalSubmit = await interaction
    .awaitModalSubmit({
      filter: (i) =>
        i.customId.startsWith("math_") && i.user.id === interaction.user.id,
      time: 30000,
    })
    .catch(() => null);

  if (!modalSubmit) {
    const timeoutEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(client.getLocale(locale, "work.job"))
      .setDescription(
        client
          .getLocale(locale, "work.timeout")
          .replace("{{answer}}", problem.answer.toString())
      )
      .setTimestamp();

    return interaction.followUp({ embeds: [timeoutEmbed], ephemeral: true });
  }

  const userAnswer = parseInt(modalSubmit.fields.getTextInputValue("answer"));

  if (userAnswer === problem.answer) {
    const earned = getReward(difficulty);
    await client.addBalance(interaction.user.id, earned);

    const successEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(client.getLocale(locale, "work.job"))
      .setDescription(
        client
          .getLocale(locale, "work.correct")
          .replace(
            "{{difficulty}}",
            client.getLocale(locale, `work.difficulty.${difficulty}`)
          )
          .replace("{{amount}}", earned.toString())
      )
      .setTimestamp();

    await modalSubmit.reply({ embeds: [successEmbed] });
  } else {
    const failEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(client.getLocale(locale, "work.job"))
      .setDescription(
        client
          .getLocale(locale, "work.wrong")
          .replace("{{answer}}", problem.answer.toString())
      )
      .setTimestamp();

    await modalSubmit.reply({ embeds: [failEmbed] });
  }
}
