import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    Message,
    MessageComponentInteraction,
    ModalBuilder,
    PermissionsString,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { getBalance, scli } from '../../sb/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

interface ShopItem {
    id: number;
    name: string;
    cost: number;
}

interface InventoryItem {
    amount: number;
    currency_shop: ShopItem[];
}

export class CurrencyCommand implements Command {
    public names = [Lang.getRef('commands/currency/name', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public devOnly = false;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const subcommand = intr.options.getSubcommand();

        switch (subcommand) {
            case Lang.getRef('commands/currency/subcommands/balance/name', Language.Default): {
                await this.executeBalance(intr, data);
                break;
            }
            case Lang.getRef('commands/currency/subcommands/backpack/name', Language.Default): {
                await this.executeBackpack(intr, data);
                break;
            }
            case Lang.getRef(
                'commands/currency/subcommands/leaderboard/subsubcommands/list/name',
                Language.Default
            ): {
                await this.executeLeaderboardList(intr, data);
                break;
            }
            case Lang.getRef(
                'commands/currency/subcommands/leaderboard/subsubcommands/anonymous/name',
                Language.Default
            ): {
                await this.executeLeaderboardAnonymous(intr, data);
                break;
            }
            case Lang.getRef('commands/currency/subcommands/sell/name', Language.Default): {
                await this.executeSell(intr, data);
                break;
            }
            case Lang.getRef('commands/currency/subcommands/shop/name', Language.Default): {
                await this.executeShop(intr, data);
                break;
            }
            case Lang.getRef('commands/currency/subcommands/work/name', Language.Default): {
                await this.executeWork(intr, data);
                break;
            }

            default:
                return;
        }
    }

    private async executeBalance(
        intr: ChatInputCommandInteraction,
        data: EventData
    ): Promise<void> {
        let args = {
            user: intr.options.getUser('user', false) || intr.user,
        };

        if (args.user.bot) {
            const embed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/balance/strings/balanceApp',
                        data.lang
                    )
                );
            InteractionUtils.send(intr, embed);
            return;
        }

        if (args.user == intr.client.user) {
            const embed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/balance/strings/balanceLuo',
                        data.lang
                    )
                );
            InteractionUtils.send(intr, embed);
            return;
        }

        const balance = await getBalance(args.user.id);
        const description =
            args.user.id === intr.user.id
                ? Lang.getRef(
                      'commands/currency/subcommands/balance/strings/balanceSelf',
                      data.lang
                  ).replaceAll('{{BALANCE}}', balance.toString())
                : Lang.getRef(
                      'commands/currency/subcommands/balance/strings/balanceOther',
                      data.lang
                  )
                      .replaceAll('{{USERID}}', args.user.id)
                      .replaceAll('{{BALANCE}}', balance.toString());

        const embed = new EmbedBuilder()
            .setColor('#111213')
            .setAuthor({
                name: args.user.username,
                iconURL: args.user.displayAvatarURL(),
            })
            .setDescription(description);

        await InteractionUtils.send(intr, {
            embeds: [embed],
            allowedMentions: {
                users: [],
            },
        });
    }

    private async executeBackpack(
        intr: ChatInputCommandInteraction,
        data: EventData
    ): Promise<void> {
        const targetUser = intr.options.getUser('user', false) || intr.user;

        try {
            const { data: items, error } = await scli
                .from('user_items')
                .select(
                    `
                    amount,
                    currency_shop(
                        id,
                        name,
                        cost
                    )
                    `
                )
                .eq('user_id', targetUser.id)
                .gt('amount', 0)
                .order('amount', { ascending: false });

            if (error) {
                console.error('Error fetching inventory:', error);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef(
                            'commands/currency/subcommands/backpack/strings/error',
                            data.lang
                        )
                    );
                await InteractionUtils.send(intr, errorEmbed);
                return;
            }

            if (!items || items.length === 0) {
                const emptyEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef(
                            'commands/currency/subcommands/backpack/strings/empty',
                            data.lang
                        )
                    );
                await InteractionUtils.send(intr, emptyEmbed);
                return;
            }

            const embed = new EmbedBuilder().setColor('#111213').setAuthor({
                name: Lang.getRef(
                    'commands/currency/subcommands/backpack/strings/title',
                    data.lang
                ).replaceAll('{user}', targetUser.username),
                iconURL: targetUser.displayAvatarURL(),
            });

            let totalItems = 0;
            items.forEach((item: InventoryItem) => {
                const shopItem = item.currency_shop[0];
                if (shopItem && item.amount > 0) {
                    const amount = parseInt(item.amount.toString());
                    embed.addFields({
                        name: shopItem.name,
                        value: `x${amount}`,
                        inline: true,
                    });
                    totalItems += amount;
                }
            });

            const maxSlots = 24;
            const availableSlots = maxSlots - totalItems;
            const sizeText =
                availableSlots === 0
                    ? `${totalItems}/${maxSlots} (${Lang.getRef('commands/currency/subcommands/backpack/strings/full', data.lang)})`
                    : `${totalItems}/${maxSlots} (${Lang.getRef('commands/currency/subcommands/backpack/strings/slotsAvailable', data.lang).replaceAll('{slots}', availableSlots)})`;

            embed.addFields({
                name: Lang.getRef('commands/currency/subcommands/backpack/strings/size', data.lang),
                value: sizeText,
                inline: false,
            });

            await InteractionUtils.send(intr, embed);
        } catch (error) {
            console.error('Error in backpack command:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('commands/currency/subcommands/backpack/strings/error', data.lang)
                );
            await InteractionUtils.send(intr, errorEmbed);
        }
    }

    private async executeLeaderboardList(
        intr: ChatInputCommandInteraction,
        data: EventData
    ): Promise<void> {
        const { data: users, error: fetchError } = await scli
            .from('users')
            .select('*')
            .order('balance', { ascending: false })
            .limit(10);

        if (fetchError) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/leaderboard/strings/error',
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, errorEmbed);
            return;
        }

        if (!users || users.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/leaderboard/strings/noUsersFound',
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, emptyEmbed);
            return;
        }

        const leaderboardEmbed = new EmbedBuilder()
            .setColor('#111213')
            .setTitle(
                Lang.getRef('commands/currency/subcommands/leaderboard/strings/title', data.lang)
            )
            .setDescription(
                Lang.getRef(
                    'commands/currency/subcommands/leaderboard/strings/description',
                    data.lang
                )
            );

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            try {
                const discordUser = await intr.client.users.fetch(user.user_id);
                leaderboardEmbed.addFields({
                    name: `#${i + 1} ${discordUser.username}`,
                    value: `${user.balance}¥`,
                    inline: true,
                });
            } catch {
                continue;
            }
        }

        await InteractionUtils.send(intr, leaderboardEmbed);
    }

    private async executeLeaderboardAnonymous(
        intr: ChatInputCommandInteraction,
        data: EventData
    ): Promise<void> {
        try {
            const { data: userData, error: fetchError } = await scli
                .from('users')
                .select('anonymous')
                .eq('user_id', intr.user.id)
                .single();

            if (fetchError) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef(
                            'commands/currency/subcommands/leaderboard/strings/errors/fetch_data',
                            data.lang
                        )
                    );
                await InteractionUtils.send(intr, errorEmbed);
                return;
            }

            const newAnonymousState = !userData?.anonymous;
            const { error: updateError } = await scli
                .from('users')
                .update({ anonymous: newAnonymousState })
                .eq('user_id', intr.user.id);

            if (updateError) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef(
                            'commands/currency/subcommands/leaderboard/strings/errors/update_data',
                            data.lang
                        )
                    );
                await InteractionUtils.send(intr, errorEmbed);
                return;
            }

            const successEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        `commands/currency/subcommands/leaderboard/strings/anonymous/${newAnonymousState ? 'enabled' : 'disabled'}`,
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, successEmbed);
        } catch {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/leaderboard/strings/error',
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, errorEmbed);
        }
    }

    private async executeSell(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const { data: userItems, error: userItemError } = await scli
            .from('user_items')
            .select('*, currency_shop(*)')
            .eq('user_id', intr.user.id)
            .gt('amount', 0);

        if (userItemError) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/sell/strings/database/error',
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, errorEmbed);
            return;
        }

        if (!userItems || userItems.length === 0) {
            const emptyEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/sell/strings/backpack/empty',
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, emptyEmbed);
            return;
        }

        const select = new StringSelectMenuBuilder()
            .setCustomId('sell_select')
            .setPlaceholder(
                Lang.getRef(
                    'commands/currency/subcommands/sell/strings/selectPlaceholder',
                    data.lang
                )
            )
            .addOptions(
                userItems.map(item =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(item.currency_shop.name)
                        .setDescription(
                            `${Math.floor(item.currency_shop.cost / 2)}¥ (${item.amount}x ${Lang.getRef(
                                'commands/currency/subcommands/sell/strings/available',
                                data.lang
                            )})`
                        )
                        .setValue(item.currency_shop.id.toString())
                )
            );

        const selectEmbed = new EmbedBuilder()
            .setColor('#111213')
            .setDescription(
                Lang.getRef(
                    'commands/currency/subcommands/sell/strings/selectItemToSell',
                    data.lang
                )
            );

        const response = await InteractionUtils.send(intr, {
            embeds: [selectEmbed],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [select.toJSON()],
                },
            ],
        });

        let currentItem = null;

        if (response instanceof Message) {
            const collector = response.createMessageComponentCollector({
                filter: (i: MessageComponentInteraction) => i.user.id === intr.user.id,
                time: 60000,
            });

            collector.on('collect', async i => {
                try {
                    if (i.customId === 'sell_select' && i.isStringSelectMenu()) {
                        const selectedItem = userItems.find(
                            item => item.currency_shop.id.toString() === i.values[0]
                        );
                        currentItem = selectedItem;

                        const buttons = [
                            new ButtonBuilder()
                                .setCustomId('sell_one')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/one',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('sell_five')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/five',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('sell_ten')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/ten',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('sell_max')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/max',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('cancel_sell')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/cancel',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Secondary),
                        ];

                        const skipButton = new ButtonBuilder()
                            .setCustomId('skip_item')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/sell/strings/skip',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Secondary);

                        const quantityEmbed = new EmbedBuilder().setColor('#111213').setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/sell/strings/selectQuantityPreset',
                                data.lang
                            )
                                .replaceAll('{{ITEM}}', currentItem.currency_shop.name)
                                .replaceAll(
                                    '{{PRICE}}',
                                    Math.floor(currentItem.currency_shop.cost / 2).toString()
                                )
                        );

                        await i.update({
                            embeds: [quantityEmbed],
                            components: [
                                {
                                    type: ComponentType.ActionRow,
                                    components: buttons.map(b => b.toJSON()),
                                },
                                {
                                    type: ComponentType.ActionRow,
                                    components: [skipButton.toJSON()],
                                },
                            ],
                        });
                    } else if (i.customId.startsWith('sell_') && i.customId !== 'sell_more') {
                        const quantity = {
                            sell_one: Math.min(1, currentItem.amount),
                            sell_five: Math.min(5, currentItem.amount),
                            sell_ten: Math.min(10, currentItem.amount),
                            sell_max: currentItem.amount,
                        }[i.customId];

                        const sellPrice = Math.floor(currentItem.currency_shop.cost / 2);
                        const totalPrice = sellPrice * quantity;

                        const { error: saleError } = await scli.rpc('sell_item', {
                            p_user_id: intr.user.id,
                            p_item_id: currentItem.currency_shop.id,
                            p_amount: quantity,
                            p_sell_price: totalPrice,
                        });

                        if (saleError) throw new Error(saleError.message);

                        const continueButtons = [
                            new ButtonBuilder()
                                .setCustomId('sell_more')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/more',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('finish_selling')
                                .setLabel(
                                    Lang.getRef(
                                        'commands/currency/subcommands/sell/strings/finish',
                                        data.lang
                                    )
                                )
                                .setStyle(ButtonStyle.Secondary),
                        ];

                        const successEmbed = new EmbedBuilder()
                            .setColor('#111213')
                            .setDescription(
                                Lang.getRef(
                                    'commands/currency/subcommands/sell/strings/itemSoldAskMore',
                                    data.lang
                                )
                                    .replaceAll('{{AMOUNT}}', quantity.toString())
                                    .replaceAll('{{ITEM}}', currentItem.currency_shop.name)
                                    .replaceAll('{{PRICE}}', totalPrice.toString())
                            );

                        await i.update({
                            embeds: [successEmbed],
                            components: [
                                {
                                    type: ComponentType.ActionRow,
                                    components: continueButtons.map(b => b.toJSON()),
                                },
                            ],
                        });
                    } else if (i.customId === 'skip_item' || i.customId === 'sell_more') {
                        currentItem = null;
                        await i.update({
                            embeds: [selectEmbed],
                            components: [
                                {
                                    type: ComponentType.ActionRow,
                                    components: [select.toJSON()],
                                },
                            ],
                        });
                    } else if (i.customId === 'finish_selling') {
                        const completeEmbed = new EmbedBuilder()
                            .setColor('#111213')
                            .setDescription(
                                Lang.getRef(
                                    'commands/currency/subcommands/sell/strings/complete',
                                    data.lang
                                )
                            );

                        await i.update({
                            embeds: [completeEmbed],
                            components: [],
                        });
                        collector.stop('finished');
                    } else if (i.customId === 'cancel_sell') {
                        const cancelEmbed = new EmbedBuilder()
                            .setColor('#111213')
                            .setDescription(
                                Lang.getRef(
                                    'commands/currency/subcommands/sell/strings/cancelled',
                                    data.lang
                                )
                            );

                        await i.update({
                            embeds: [cancelEmbed],
                            components: [],
                        });
                        collector.stop('cancelled');
                    }
                } catch {
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/sell/strings/error',
                                data.lang
                            )
                        );

                    await i.update({
                        embeds: [errorEmbed],
                        components: [],
                    });
                    collector.stop('error');
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    try {
                        const timeoutEmbed = new EmbedBuilder()
                            .setColor('#111213')
                            .setDescription(
                                Lang.getRef(
                                    'commands/currency/subcommands/sell/strings/timeout',
                                    data.lang
                                )
                            );

                        await InteractionUtils.editReply(intr, {
                            embeds: [timeoutEmbed],
                            components: [],
                        });
                    } catch {
                        //
                    }
                }
            });
        }
    }

    private async executeShop(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        try {
            const { data: shopItems, error: shopError } = await scli
                .from('currency_shop')
                .select('*')
                .eq('disabled', false)
                .order('cost', { ascending: true });

            if (shopError) {
                console.error('Error fetching shop items:', shopError);
                const errorEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef('commands/currency/subcommands/shop/strings/error', data.lang)
                    );
                await InteractionUtils.send(intr, errorEmbed);
                return;
            }

            if (!shopItems || shopItems.length === 0) {
                const emptyEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef('commands/currency/subcommands/shop/strings/empty', data.lang)
                    );
                await InteractionUtils.send(intr, emptyEmbed);
                return;
            }

            const selectEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/currency/subcommands/shop/strings/selectItemToBuy',
                        data.lang
                    )
                );

            const select = new StringSelectMenuBuilder()
                .setCustomId('shop_select')
                .setPlaceholder(
                    Lang.getRef(
                        'commands/currency/subcommands/shop/strings/selectPlaceholder',
                        data.lang
                    )
                )
                .addOptions(
                    shopItems.map(item =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(item.name)
                            .setDescription(`${item.cost}¥`)
                            .setValue(item.id.toString())
                    )
                );

            const response = await InteractionUtils.send(intr, {
                embeds: [selectEmbed],
                components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
            });

            if (!(response instanceof Message)) {
                throw new Error('Failed to send shop embed.');
            }

            const collector = response.createMessageComponentCollector({
                filter: i => i.user.id === intr.user.id,
                time: 60000,
            });

            let currentItem: ShopItem | null = null;

            collector.on('collect', async i => {
                if (i.isStringSelectMenu()) {
                    const selectedItemId = i.values[0];
                    currentItem =
                        shopItems.find(item => item.id.toString() === selectedItemId) || null;

                    if (!currentItem) {
                        throw new Error('Selected item not found.');
                    }

                    const quantityButtons = [
                        new ButtonBuilder()
                            .setCustomId('buy_one')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/one',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('buy_five')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/five',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('buy_ten')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/ten',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('buy_max')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/max',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('cancel_buy')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/cancel',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Danger),
                    ];

                    const quantityEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/shop/strings/selectQuantityPreset',
                                data.lang
                            )
                                .replaceAll('{{ITEM}}', currentItem.name)
                                .replaceAll('{{COST}}', currentItem.cost.toString())
                        );

                    await i.update({
                        embeds: [quantityEmbed],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>().addComponents(quantityButtons),
                        ],
                    });
                } else if (i.isButton()) {
                    if (!currentItem) {
                        throw new Error('No item selected.');
                    }

                    const quantity = {
                        buy_one: 1,
                        buy_five: 5,
                        buy_ten: 10,
                        buy_max: Math.floor((await getBalance(intr.user.id)) / currentItem.cost),
                    }[i.customId];

                    const totalCost = currentItem.cost * quantity;

                    const { error: purchaseError } = await scli.rpc('buy_item', {
                        p_user_id: intr.user.id,
                        p_item_id: currentItem.id,
                        p_amount: quantity,
                        p_total_cost: totalCost,
                    });

                    if (purchaseError) {
                        if (purchaseError.message.includes('insufficient_balance')) {
                            const insufficientEmbed = new EmbedBuilder()
                                .setColor('#111213')
                                .setDescription(
                                    Lang.getRef(
                                        'commands/currency/subcommands/shop/strings/notEnoughBalance',
                                        data.lang
                                    )
                                );
                            await i.update({ embeds: [insufficientEmbed], components: [] });
                            return;
                        }
                        throw purchaseError;
                    }

                    const continueButtons = [
                        new ButtonBuilder()
                            .setCustomId('buy_more')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/more',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('finish_buying')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/shop/strings/finish',
                                    data.lang
                                )
                            )
                            .setStyle(ButtonStyle.Secondary),
                    ];

                    const successEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/shop/strings/itemPurchasedAskMore',
                                data.lang
                            )
                                .replaceAll('{{QUANTITY}}', quantity.toString())
                                .replaceAll('{{ITEM}}', currentItem.name)
                        );

                    await i.update({
                        embeds: [successEmbed],
                        components: [
                            new ActionRowBuilder<ButtonBuilder>().addComponents(continueButtons),
                        ],
                    });
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const timeoutEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/shop/strings/timeout',
                                data.lang
                            )
                        );

                    await InteractionUtils.editReply(intr, {
                        embeds: [timeoutEmbed],
                        components: [],
                    });
                }
            });
        } catch (error) {
            console.error('Error in shop command:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('commands/currency/subcommands/shop/strings/error', data.lang)
                );

            await InteractionUtils.send(intr, errorEmbed);
        }
    }

    private async executeWork(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const number = Math.floor(Math.random() * 100) + 1;
        let attempts = 5;

        const startEmbed = new EmbedBuilder()
            .setColor('#111213')
            .setTitle(
                Lang.getRef('commands/currency/subcommands/work/strings/guessTitle', data.lang)
            )
            .setDescription(
                Lang.getRef('commands/currency/subcommands/work/strings/guessStart', data.lang)
            );

        const startButton = new ButtonBuilder()
            .setCustomId('startGuessing')
            .setLabel(
                Lang.getRef('commands/currency/subcommands/work/strings/startGuess', data.lang)
            )
            .setStyle(ButtonStyle.Success);

        const response = await InteractionUtils.send(intr, {
            embeds: [startEmbed],
            components: [new ActionRowBuilder<ButtonBuilder>().addComponents(startButton)],
        });

        if (response instanceof Message) {
            const collector = response.createMessageComponentCollector({
                filter: (i: MessageComponentInteraction) => i.user.id === intr.user.id,
                time: 60000,
            });

            collector.on('collect', async i => {
                if (i.customId == 'startGuessing') {
                    let gameMessage = null;

                    while (attempts > 0) {
                        const modal = new ModalBuilder()
                            .setCustomId('guess_modal')
                            .setTitle(
                                Lang.getRef(
                                    'commands/currency/subcommands/work/strings/guessModalTitle',
                                    data.lang
                                )
                            );

                        const guessInput = new TextInputBuilder()
                            .setCustomId('guess')
                            .setLabel(
                                Lang.getRef(
                                    'commands/currency/subcommands/work/strings/guessPrompt',
                                    data.lang
                                ).replaceAll('{{ATTEMPTS}}', attempts.toString())
                            )
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(3)
                            .setMinLength(1)
                            .setPlaceholder('1-100')
                            .setRequired(true);

                        const firstActionRow =
                            new ActionRowBuilder<TextInputBuilder>().addComponents(guessInput);
                        modal.addComponents(firstActionRow);

                        await i.showModal(modal);

                        try {
                            const modalResponse = await i.awaitModalSubmit({
                                filter: i => i.user.id === intr.user.id,
                                time: 60000,
                            });

                            // Defer the modal submission before editing the reply
                            await modalResponse.deferUpdate();

                            const guess = parseInt(modalResponse.fields.getTextInputValue('guess'));

                            if (isNaN(guess) || guess < 1 || guess > 100) {
                                const invalidEmbed = new EmbedBuilder()
                                    .setColor('#111213')
                                    .setDescription(
                                        Lang.getRef(
                                            'commands/currency/subcommands/work/strings/guessInvalid',
                                            data.lang
                                        )
                                    );
                                await modalResponse.followUp({
                                    embeds: [invalidEmbed],
                                    ephemeral: true,
                                });
                                continue;
                            }

                            attempts--;

                            if (guess === number) {
                                collector.stop('finished');

                                const reward = Math.max(10, 30 - (5 - attempts) * 5);
                                await scli.rpc('add_balance', {
                                    p_user_id: intr.user.id,
                                    p_amount: reward,
                                });

                                const winEmbed = new EmbedBuilder()
                                    .setColor('#111213')
                                    .setDescription(
                                        Lang.getRef(
                                            'commands/currency/subcommands/work/strings/guessWin',
                                            data.lang
                                        ).replaceAll('{{REWARD}}', reward.toString())
                                    );

                                if (gameMessage) {
                                    await gameMessage.edit({ embeds: [winEmbed], components: [] });
                                } else {
                                    await modalResponse.editReply({
                                        embeds: [winEmbed],
                                        components: [],
                                    });
                                }

                                setTimeout(async () => {
                                    if (gameMessage) {
                                        await gameMessage.delete().catch(console.error);
                                    }
                                }, 5000);

                                return;
                            } else {
                                const hint =
                                    guess > number
                                        ? Lang.getRef(
                                              'commands/currency/subcommands/work/strings/guessLower',
                                              data.lang
                                          )
                                        : Lang.getRef(
                                              'commands/currency/subcommands/work/strings/guessHigher',
                                              data.lang
                                          );

                                const hintEmbed = new EmbedBuilder()
                                    .setColor('#111213')
                                    .setDescription(
                                        `${hint}\n${Lang.getRef(
                                            'commands/currency/subcommands/work/strings/guessRemaining',
                                            data.lang
                                        ).replaceAll('{{ATTEMPTS}}', attempts.toString())}`
                                    );

                                if (gameMessage) {
                                    await gameMessage.edit({ embeds: [hintEmbed] });
                                } else {
                                    gameMessage = await modalResponse.editReply({
                                        embeds: [hintEmbed],
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('Modal submission error:', error);
                            collector.stop('finished');
                            const timeoutEmbed = new EmbedBuilder()
                                .setColor('#111213')
                                .setDescription(
                                    Lang.getRef(
                                        'commands/currency/subcommands/work/strings/guessTimeout',
                                        data.lang
                                    )
                                );
                            await InteractionUtils.editReply(intr, {
                                embeds: [timeoutEmbed],
                                components: [],
                            });

                            setTimeout(async () => {
                                if (gameMessage) {
                                    await gameMessage.delete().catch(console.error);
                                }
                            }, 5000);

                            return;
                        }
                    }

                    collector.stop('finished');

                    const loseEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/work/strings/guessLose',
                                data.lang
                            ).replaceAll('{{NUMBER}}', number.toString())
                        );

                    if (gameMessage) {
                        await gameMessage.edit({ embeds: [loseEmbed], components: [] });
                    } else {
                        await InteractionUtils.editReply(intr, {
                            embeds: [loseEmbed],
                            components: [],
                        });
                    }

                    setTimeout(async () => {
                        if (gameMessage) {
                            await gameMessage.delete().catch(console.error);
                        }
                    }, 5000);
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const timeoutEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef(
                                'commands/currency/subcommands/work/strings/guessTimeout',
                                data.lang
                            )
                        );

                    await InteractionUtils.editReply(intr, {
                        embeds: [timeoutEmbed],
                        components: [],
                    });
                }
            });
        }
    }
}
