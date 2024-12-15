import MainClient from "./luoxiaohei.js";
import { EmbedBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import { scheduleJob } from "node-schedule";

const client = new MainClient();
client.start().catch(console.error);
export default client;

const targetDate = new Date("2024-12-16T00:00:00+02:00");

scheduleJob(targetDate, async () => {
  const guild = await client.guilds.fetch("1200839660302245948");
  const userId = "1077148007625129984";

  const birthdayCategory = await guild.channels.create({
    name: "🎂 Mad Gamer",
    type: ChannelType.GuildCategory,
    position: 0,
  });

  const birthdayChannel = await guild.channels.create({
    name: "🎂・с-днем-рождения",
    type: ChannelType.GuildText,
    parent: birthdayCategory.id,
    permissionOverwrites: [
      {
        id: guild.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.ReadMessageHistory,
        ],
        deny: [PermissionFlagsBits.SendMessages],
      },
      {
        id: client.user.id,
        allow: [PermissionFlagsBits.SendMessages],
      },
    ],
  });

  const embed = new EmbedBuilder()
    .setColor("#521c76")
    .setTitle("С Днем Рождения, Mad Gamer! 🎉🎊")
    .setDescription(
      "Дорогой друг!\n\nПоздравляю тебя с днем рождения! В этот особенный день хочу пожелать тебе бесконечного счастья, крепкого здоровья и невероятных успехов во всех начинаниях! Пусть каждый день будет наполнен радостью, улыбками и приятными сюрпризами.\n\nПусть все твои мечты становятся реальностью, а жизнь будет полна ярких красок и незабываемых моментов. Желаю тебе верных друзей, любящих близких и много-много позитивных эмоций!\n\nВ честь этого замечательного праздника, ты получаешь 47 йен! Это небольшой подарок от меня, который, надеюсь, добавит немного радости в этот прекрасный день! 🎂✨\n\nС наилучшими пожеланиями,\nТвой друг Ло Сяохэй 🐱"
    )
    .setTimestamp();

  await birthdayChannel.send({
    content: `<@${userId}>`,
    embeds: [embed],
  });

  await client.addBalance(userId, 47);
});
