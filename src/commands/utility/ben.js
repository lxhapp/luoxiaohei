import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";

export const beta = false;
export const cooldown = 4;
export const data = new SlashCommandBuilder()
  .setName("ben")
  .setDescription("*answers* Ben!")
  .setDescriptionLocalizations({
    ru: "*отвечает* Бен!",
    uk: "*відповідає* Бен!",
    ja: "*答えます* ベン！",
  })
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("You are talking with Ben. You might ask him for now")
      .setDescriptionLocalizations({
        ru: "Вы разговариваете с Беном. Вы можете спросить его сейчас",
        uk: "Ви розмовляєте з Беном. Ви можете запитати його зараз",
        ja: "ベンと話しています。今すぐ質問することができます",
      })
      .setRequired(true)
  )
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);
export async function run({ interaction, client }) {
  await interaction.deferReply({
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
  const { locale } = interaction;
  const question = interaction.options.getString("question");
  const words = [
    client.getLocale(locale, `benYes`),
    client.getLocale(locale, `benNo`),
    "😜",
    "😂",
  ];
  const answerEmbed = new EmbedBuilder()
    .setColor("#212226")
    .setAuthor({
      name: `My Talking Ben`,
    })
    .setThumbnail(
      "https://static.wikia.nocookie.net/outfit7talkingfriends/images/8/80/Talking_Ben_the_Dog_Original_HD_Icon.png"
    )
    .addFields({
      name: interaction.user.displayName,
      value: `${question}`,
      inline: true,
    })
    .addFields({
      name: client.getLocale(locale, `ben`),
      value: `${words[Math.floor(Math.random() * words.length)]}`,
      inline: true,
    });
  await interaction.editReply({
    embeds: [answerEmbed],
    allowedMentions: {
      repliedUser: false,
    },
    flags: [4096],
  });
}
