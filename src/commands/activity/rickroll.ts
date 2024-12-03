import {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationCommandType,
} from "discord.js";

export const beta = false;
export const cooldown = 60;
export const data: any = {
  ...new SlashCommandBuilder()
    .setName("rickroll")
    .setNameLocalizations({
      ru: "рикролл",
      uk: "рікролл",
      ja: "リックロール",
    })
    .setDescription("Rickroll others with Activities!")
    .setDescriptionLocalizations({
      ru: "Рикроллируйте других с помощью Активностей!",
      uk: "Рікролліруйте інших за допомогою діяльності!",
      ja: "アクティビティを使用して他の人をリックロールします！",
    })
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel
    )
    .setIntegrationTypes([0, 1])
    .toJSON(),
  type: ApplicationCommandType.PrimaryEntryPoint,
};

export async function run() {
  return;
}
