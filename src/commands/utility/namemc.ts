import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
} from "discord.js";
import axios, { AxiosResponse } from "axios";

export const beta = false;
export const data = new SlashCommandBuilder()
  .setName("namemc")
  .setDescription("Get Minecraft player information from NameMC")
  .setDescriptionLocalizations({
    ru: "Получить информацию об игроке Minecraft из NameMC",
    uk: "Отримати інформацію про гравця Minecraft з NameMC",
    ja: "NameMCからMinecraftプレイヤー情報を取得",
  })
  .addSubcommand((subcommand) =>
    subcommand
      .setName("player")
      .setDescription("Get player information by username")
      .setDescriptionLocalizations({
        ru: "Получить информацию об игроке Minecraft по его нику",
        uk: "Отримати інформацію про гравця Minecraft за його ніком",
        ja: "ユーザー名からMinecraftプレイヤー情報を取得",
      })
      .addStringOption((option) =>
        option
          .setName("username")
          .setDescription("Minecraft username")
          .setDescriptionLocalizations({
            ru: "Ник игрока Minecraft",
            uk: "Нік гравця Minecraft",
            ja: "Minecraftのユーザー名",
          })
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("uuid")
      .setDescription("Get player information by UUID")
      .setDescriptionLocalizations({
        ru: "Получить информацию об игроке Minecraft по его UUID",
        uk: "Отримати інформацію про гравця Minecraft за його UUID",
        ja: "UUIDからMinecraftプレイヤー情報を取得",
      })
      .addStringOption((option) =>
        option
          .setName("uuid")
          .setDescription("Minecraft UUID")
          .setDescriptionLocalizations({
            ru: "UUID игрока Minecraft",
            uk: "UUID гравця Minecraft",
            ja: "MinecraftのUUID",
          })
          .setRequired(true)
      )
  );

export async function run({ interaction, client }) {
  const { locale } = interaction;
  const subcommand = interaction.options.getSubcommand();

  try {
    let playerData;
    if (subcommand === "player") {
      const username = interaction.options.getString("username");
      const mojangResponse = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${username}`
      );
      playerData = {
        uuid: mojangResponse.data.id,
        currentName: mojangResponse.data.name,
      };
    } else {
      const uuid = interaction.options.getString("uuid");
      const mojangResponse = await axios.get(
        `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
      );
      playerData = {
        uuid: mojangResponse.data.id,
        currentName: mojangResponse.data.name,
      };
    }

    const embed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setTitle(playerData.currentName)
      .setThumbnail(`https://mc-heads.net/avatar/${playerData.uuid}`)
      .addFields({ name: "UUID", value: playerData.uuid, inline: true })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(client.embedColor)
      .setDescription(client.getLocale(locale, "namemc.error"))
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}
