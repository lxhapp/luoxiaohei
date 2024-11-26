import {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { supabase } from "../../db/main.js";

export const beta = false;
export const cooldown = 6;
export const data = new SlashCommandBuilder()
  .setName("sell")
  .setDescription("Sell an item from your inventory")
  .setDescriptionLocalizations({
    ru: "Продать предмет из инвентаря",
    uk: "Продати предмет з інвентаря",
    ja: "インベントリからアイテムを販売する",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

export async function run({ interaction, client }) {
  const { locale } = interaction;

  // Fetch user's inventory
  const { data: userItems, error: userItemError } = await supabase
    .from("user_items")
    .select("*, currency_shop(*)")
    .eq("user_id", interaction.user.id)
    .gt("amount", 0);

  if (userItemError) {
    console.error("Error fetching user items:", userItemError);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "sell.database.error")),
      ],
    });
  }

  if (!userItems || userItems.length === 0) {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "sell.inventory.empty")),
      ],
    });
  }

  // Create the sell embed
  const embed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setDescription(client.getLocale(locale, "sell.selectItemToSell"));

  // Create the dropdown menu
  const select = new StringSelectMenuBuilder()
    .setCustomId("sell_select")
    .setPlaceholder(client.getLocale(locale, "sell.selectPlaceholder"))
    .addOptions(
      userItems.map((item) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(item.currency_shop.name)
          .setDescription(
            `${Math.floor(item.currency_shop.cost / 2)}¥ each (${
              item.amount
            }x ${client.getLocale(locale, "sell.available")})`
          )
          .setValue(item.currency_shop.id.toString())
      )
    );

  const row = new ActionRowBuilder().addComponents(select);
  const response = await interaction.editReply({
    embeds: [embed],
    components: [row],
  });

  // Create quantity buttons
  const quantityRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("sell_one")
      .setLabel(client.getLocale(locale, "sell.one"))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("sell_five")
      .setLabel(client.getLocale(locale, "sell.five"))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("sell_ten")
      .setLabel(client.getLocale(locale, "sell.ten"))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("sell_max")
      .setLabel(client.getLocale(locale, "sell.max"))
      .setStyle(ButtonStyle.Primary)
  );

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("skip_item")
      .setLabel(client.getLocale(locale, "sell.skip"))
      .setStyle(ButtonStyle.Secondary)
  );

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = response.createMessageComponentCollector({
    filter,
    time: 300000, // 5 minutes
  });

  let currentItem = null;

  collector.on("collect", async (i) => {
    try {
      if (i.customId === "sell_select") {
        const selectedItem = userItems.find(
          (item) => item.currency_shop.id.toString() === i.values[0]
        );
        currentItem = selectedItem;

        const quantityEmbed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            client
              .getLocale(locale, "sell.selectQuantityPreset")
              .replace("{item}", currentItem.currency_shop.name)
              .replace(
                "{price}",
                Math.floor(currentItem.currency_shop.cost / 2)
              )
          );

        await i.update({
          embeds: [quantityEmbed],
          components: [quantityRow, actionRow],
        });
      } else if (i.customId.startsWith("sell_") && i.customId !== "sell_more") {
        const quantity = {
          sell_one: Math.min(1, currentItem.amount),
          sell_five: Math.min(5, currentItem.amount),
          sell_ten: Math.min(10, currentItem.amount),
          sell_max: currentItem.amount,
        }[i.customId];

        const sellPrice = Math.floor(currentItem.currency_shop.cost / 2);
        const totalPrice = sellPrice * quantity;

        const { error: saleError } = await supabase.rpc("sell_item", {
          p_user_id: interaction.user.id,
          p_item_id: currentItem.currency_shop.id,
          p_amount: quantity,
          p_sell_price: totalPrice,
        });

        if (saleError) {
          throw new Error(saleError.message);
        }

        const successEmbed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(
            client
              .getLocale(locale, "sell.itemSoldAskMore")
              .replace("{amount}", quantity)
              .replace("{item}", currentItem.currency_shop.name)
              .replace("{price}", totalPrice)
          );

        const continueRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("sell_more")
            .setLabel(client.getLocale(locale, "sell.more"))
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("finish_selling")
            .setLabel(client.getLocale(locale, "sell.finish"))
            .setStyle(ButtonStyle.Secondary)
        );

        await i.update({
          embeds: [successEmbed],
          components: [continueRow],
        });
      } else if (i.customId === "skip_item" || i.customId === "sell_more") {
        currentItem = null;
        await i.update({
          embeds: [embed],
          components: [row],
        });
      } else if (i.customId === "finish_selling") {
        const finalEmbed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "sell.complete"));

        await i.update({
          embeds: [finalEmbed],
          components: [],
        });
        collector.stop("finished");
      }
    } catch (error) {
      console.error("Sell interaction error:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor(client.embedColor)
        .setDescription(client.getLocale(locale, "sell.error"));

      await i.update({
        embeds: [errorEmbed],
        components: [],
      });
      collector.stop("error");
    }
  });

  collector.on("end", async (collected, reason) => {
    if (reason === "time") {
      try {
        const timeoutEmbed = new EmbedBuilder()
          .setColor(client.embedColor)
          .setDescription(client.getLocale(locale, "sell.timeout"));

        await interaction.editReply({
          embeds: [timeoutEmbed],
          components: [],
        });
      } catch (error) {
        console.error("Error sending timeout message:", error);
      }
    }
  });
}
