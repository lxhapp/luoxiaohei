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
export const cooldown = 28;
export const data = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Browse and purchase items from the shop")
  .setDescriptionLocalizations({
    ru: "Просматривайте и покупайте предметы в магазине",
    uk: "Переглядайте та купуйте предмети в магазині",
    ja: "ショップでアイテムを閲覧・購入する",
  })
  .setContexts(
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel
  )
  .setIntegrationTypes([0, 1]);

async function getCurrentInventoryCount(userId) {
    const { data, error } = await supabase
        .from('user_items')
        .select(`
            amount,
            currency_shop(id, name)
        `)
        .eq('user_id', userId)
        .not('amount', 'eq', 0);

    if (error) {
        console.error('Error fetching inventory count:', error);
        return 0;
    }

    console.log("Shop inventory data:", data);
    
    const total = data.reduce((total, item) => {
        if (item.currency_shop && item.amount > 0) {
            const amount = parseInt(item.amount);
            console.log(`Adding ${amount} to total ${total}`);
            return total + amount;
        }
        return total;
    }, 0);

    console.log("Shop inventory count:", total);
    return total;
}

async function addItemToInventory(userId, itemId, amount) {
  const { data, error } = await supabase
    .rpc('add_item_to_inventory', {
      p_user_id: userId,
      p_item_id: itemId,
      p_amount: amount
    });

  if (error) {
    throw new Error(`Failed to add item: ${error.message}`);
  }

  return data;
}

export async function run({ interaction, client }) {
  const { data: items, error } = await supabase
    .from("currency_shop")
    .select("*")
    .eq("disabled", false)
    .order("cost", { ascending: true });

  if (error) {
    console.error("Error fetching shop items:", error);
    return interaction.editReply(
      client.getLocale(interaction.locale, "shopError")
    );
  }

  if (!items || items.length === 0) {
    return interaction.editReply(
      client.getLocale(interaction.locale, "shopEmpty")
    );
  }

  // Create the shop embed
  const embed = new EmbedBuilder()
    .setColor(client.embedColor)
    .setDescription(client.getLocale(interaction.locale, "selectItemToBuy"));

  // Create the dropdown menu (single selection)
  const select = new StringSelectMenuBuilder()
    .setCustomId("shop_select")
    .setPlaceholder(client.getLocale(interaction.locale, "shopSelectPlaceholder"))
    .addOptions(
      items.map((item) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(item.name)
          .setDescription(`${item.cost}¥`)
          .setValue(item.id.toString())
      )
    );

  const row = new ActionRowBuilder().addComponents(select);
  const response = await interaction.editReply({
    embeds: [embed],
    components: [row],
  });

  const filter = (i) => i.user.id === interaction.user.id;
  const collector = response.createMessageComponentCollector({
    filter,
    time: 300000, // 5 minutes
  });

  let selectedItems = new Map(); // Store selected items and their quantities
  let currentItem = null;
  let currentQuantity = 1;

  // Create quantity buttons
  const quantityRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("buy_one")
      .setLabel(client.getLocale(interaction.locale, "buyOne"))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("buy_five")
      .setLabel(client.getLocale(interaction.locale, "buyFive"))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("buy_ten")
      .setLabel(client.getLocale(interaction.locale, "buyTen"))
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("buy_max")
      .setLabel(client.getLocale(interaction.locale, "buyMax"))
      .setStyle(ButtonStyle.Primary)
  );

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("skip_item")
      .setLabel(client.getLocale(interaction.locale, "skipItem"))
      .setStyle(ButtonStyle.Secondary)
  );

  collector.on("collect", async (i) => {
    try {
        if (i.customId === "shop_select") {
            currentItem = items.find(item => item.id.toString() === i.values[0]);
            
            const quantityEmbed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(
                    client.getLocale(interaction.locale, "selectQuantityPreset")
                        .replace("{item}", currentItem.name)
                        .replace("{cost}", currentItem.cost)
                );

            await i.update({
                embeds: [quantityEmbed],
                components: [quantityRow, actionRow],
            });
        } else if (i.customId.startsWith("buy_") && i.customId !== "buy_more") {
            const currentCount = await getCurrentInventoryCount(interaction.user.id);
            console.log("Current inventory count:", currentCount);
            
            const maxSlots = 24;
            const availableSlots = maxSlots - currentCount;
            console.log("Available slots:", availableSlots);

            if (availableSlots <= 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(client.getLocale(interaction.locale, "inventoryFull"));
                await i.update({ embeds: [errorEmbed], components: [] });
                collector.stop("inventory_full");
                return;
            }

            const quantity = {
                "buy_one": Math.min(1, availableSlots),
                "buy_five": Math.min(5, availableSlots),
                "buy_ten": Math.min(10, availableSlots),
                "buy_max": availableSlots
            }[i.customId];

            // Process purchase
            const { error } = await supabase.rpc("buy_item", {
                p_user_id: interaction.user.id,
                p_item_id: currentItem.id,
                p_amount: quantity,
                p_cost: currentItem.cost * quantity
            });

            if (error) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(client.embedColor)
                    .setDescription(
                        error.message.includes("Insufficient balance")
                            ? client.getLocale(interaction.locale, "notEnoughBalance")
                            : client.getLocale(interaction.locale, "purchaseError")
                    );
                await i.update({ embeds: [errorEmbed], components: [] });
                collector.stop("purchase_error");
                return;
            }

            // Show success and ask if want to buy more
            const successEmbed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(
                    client.getLocale(interaction.locale, "itemPurchasedAskMore")
                        .replace("{item}", currentItem.name)
                        .replace("{quantity}", quantity)
                );

            const continueRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("buy_more")
                    .setLabel(client.getLocale(interaction.locale, "buyMore"))
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("finish_shopping")
                    .setLabel(client.getLocale(interaction.locale, "finishShopping"))
                    .setStyle(ButtonStyle.Secondary)
            );

            await i.update({
                embeds: [successEmbed],
                components: [continueRow],
            });
        } else if (i.customId === "skip_item" || i.customId === "buy_more") {
            currentItem = null;
            currentQuantity = 1;

            await i.update({
                embeds: [embed],
                components: [row],
            });
        } else if (i.customId === "finish_shopping") {
            const finalEmbed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(client.getLocale(interaction.locale, "shoppingComplete"));
            
            await i.update({
                embeds: [finalEmbed],
                components: [],
            });
            collector.stop("finished");
        }
    } catch (error) {
        console.error("Shop interaction error:", {
            error: error,
            customId: i.customId,
            messageId: i.message.id,
            channelId: i.channelId,
            guildId: i.guildId
        });

        try {
            const errorEmbed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(client.getLocale(interaction.locale, "shopError"));
            
            await i.update({
                embeds: [errorEmbed],
                components: [],
            });
        } catch (followUpError) {
            console.error("Failed to send error message:", followUpError);
        }
        collector.stop("error");
    }
  });

  collector.on("end", async (collected, reason) => {
    if (reason === "time") {
        try {
            const timeoutEmbed = new EmbedBuilder()
                .setColor(client.embedColor)
                .setDescription(client.getLocale(interaction.locale, "shopTimeout"));

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
