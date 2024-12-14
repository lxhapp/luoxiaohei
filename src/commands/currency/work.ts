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
  switch (difficulty) {
    case "easy":
      return generateChainedCalculation("easy", 2, 3, 1, 20);

    case "medium":
      return generateChainedCalculation("medium", 3, 4, 1, 50);

    case "hard":
      return generateChainedCalculation("hard", 4, 5, 1, 100);

    case "extreme":
      return generateChainedCalculation("extreme", 5, 7, 1, 1000);
  }
}

function generateChainedCalculation(
  difficulty: string,
  minOps: number,
  maxOps: number,
  minNum: number,
  maxNum: number
) {
  const operationCount =
    Math.floor(Math.random() * (maxOps - minOps + 1)) + minOps;
  let numbers: number[] = [];
  let operators: string[] = [];

  numbers.push(Math.floor(Math.random() * (maxNum - minNum)) + minNum);

  for (let i = 0; i < operationCount; i++) {
    const nextNum = Math.floor(Math.random() * (maxNum / 2 - minNum)) + minNum;
    numbers.push(nextNum);

    let possibleOperators = ["+", "-"];
    if (difficulty !== "easy") possibleOperators.push("*");
    if (difficulty === "hard" || difficulty === "extreme")
      possibleOperators.push("/");

    operators.push(
      possibleOperators[Math.floor(Math.random() * possibleOperators.length)]
    );
  }

  const question = numbers.reduce((acc, num, i) => {
    if (i === 0) return num.toString();
    return `${acc} ${operators[i - 1]} ${num}`;
  }, "");

  let answer = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    switch (operators[i]) {
      case "+":
        answer += numbers[i + 1];
        break;
      case "-":
        answer -= numbers[i + 1];
        break;
      case "*":
        answer *= numbers[i + 1];
        break;
      case "/":
        answer = Math.round(answer / numbers[i + 1]);
        break;
    }
  }

  return {
    question: `${question} = ?`,
    answer: Math.round(answer),
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

  if (!modalSubmit || modalSubmit.isFromMessage) {
    return;
  }

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
