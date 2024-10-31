import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} from "discord.js";
import { hostname, totalmem, freemem, cpus, arch, release } from "os";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  1;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const beta = false;
export const cooldown = 30;
export const data = new SlashCommandBuilder()
  .setName("os")
  .setDescription("Replies with info about current process")
  .setDescriptionLocalizations({
    ru: "Отвечает с информацией о текущем процессе",
    uk: "Відповідає з інформацією про поточний процес",
    ja: "現在のプロセスに関する情報を返します",
  })
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
  const embed = new EmbedBuilder()
    .setColor("#212226")
    .addFields({
      name: client.getLocale(locale, "host"),
      value: `${hostname()}`,
      inline: false,
    })
    .addFields({
      name: "RAM",
      value: `${formatBytes(totalmem() - freemem())} | ${formatBytes(
        totalmem()
      )}`,
      inline: false,
    })
    .addFields({
      name: "CPU",
      value: `${cpus()[0].model}`,
      inline: false,
    })
    .addFields({
      name: "Arch",
      value: `${arch()}`,
      inline: false,
    })
    .addFields({
      name: client.getLocale(locale, "release"),
      value: `${release()}`,
      inline: false,
    });
  interaction.editReply({
    embeds: [embed],
  });
}
