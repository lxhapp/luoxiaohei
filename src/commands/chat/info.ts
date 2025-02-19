import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionsString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { scli } from '../../sb/index.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class InfoCommand implements Command {
    public names = [Lang.getRef('commands/info/name', Language.Default)];
    public cooldown = new RateLimiter(1, 6000);
    public deferType = CommandDeferType.PUBLIC;
    public devOnly = true;
    public requireClientPerms: PermissionsString[] = [];
    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        let args = {
            user: intr.options.getUser('user', false) || intr.user,
        };

        const subcommands = intr.options.getSubcommand();

        switch (subcommands) {
            case Lang.getRef('commands/info/subcommands/guild/name', Language.Default): {
                const { name, createdTimestamp } = intr.guild;

                let baseVerif = intr.guild.verificationLevel;
                baseVerif =
                    baseVerif === 0
                        ? Lang.getRef('commands/info/strings/none', data.lang)
                        : baseVerif === 1
                          ? Lang.getRef('commands/info/strings/low', data.lang)
                          : baseVerif === 2
                            ? Lang.getRef('commands/info/strings/mid', data.lang)
                            : baseVerif === 3
                              ? Lang.getRef('commands/info/strings/high', data.lang)
                              : baseVerif === 4
                                ? Lang.getRef('commands/info/strings/veryhigh', data.lang)
                                : baseVerif;

                const guildInfoEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .addFields({
                        name: Lang.getRef('commands/info/strings/name', data.lang),
                        value: `${name}`,
                        inline: false,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/creation', data.lang),
                        value: `<t:${Math.round(createdTimestamp / 1000)}:R>`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/owner', data.lang),
                        value: `<@${intr.guild.ownerId}>`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/members', data.lang),
                        value: `${intr.guild.memberCount}`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/roles', data.lang),
                        value: `${intr.guild.roles.cache.size}`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/emojis', data.lang),
                        value: `${intr.guild.emojis.cache.size}`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/verifylvl', data.lang),
                        value: `${baseVerif}`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/boosts', data.lang),
                        value: `${intr.guild.premiumSubscriptionCount}`,
                        inline: true,
                    })
                    .setFooter({
                        text: `ID: ${intr.guild.id}`,
                    });

                if (intr.guild.iconURL()) {
                    guildInfoEmbed.setAuthor({
                        name: name,
                        iconURL: intr.guild.iconURL(),
                    });
                    guildInfoEmbed.setThumbnail(intr.guild.iconURL());
                } else {
                    guildInfoEmbed.setAuthor({
                        name: name,
                    });
                }

                InteractionUtils.send(intr, guildInfoEmbed);
                break;
            }

            case Lang.getRef('commands/info/subcommands/user/name', Language.Default): {
                const user = await intr.guild.members.fetch(args.user.id);

                const { data: userData, error } = await scli
                    .from('users')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                let isRegistered = error ? false : userData ? true : null;
                let isVerified = userData?.verified !== undefined ? userData.verified : null;
                let balance = userData?.balance !== undefined ? userData.balance : null;

                const uInfoEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setAuthor({
                        name: args.user.tag,
                        iconURL: args.user.displayAvatarURL(),
                    })
                    .setThumbnail(args.user.displayAvatarURL())
                    .addFields({
                        name: Lang.getRef('commands/info/strings/roles', data.lang),
                        value: String(user.roles.cache.map(r => r).join(' ')),
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/createdDate', data.lang),
                        value: `<t:${Math.round(args.user.createdAt.getTime() / 1000)}:R>`,
                        inline: true,
                    })
                    .addFields({
                        name: Lang.getRef('commands/info/strings/joinedDate', data.lang),
                        value: `<t:${Math.round(user.joinedAt.getTime() / 1000)}:R>`,
                        inline: true,
                    })
                    .addFields([
                        {
                            name: Lang.getRef('commands/info/strings/registered', data.lang),
                            value:
                                isRegistered !== null
                                    ? '<:success:1335181909751365673>'
                                    : '<:fail:1335182303705563146>',
                            inline: true,
                        },
                        {
                            name: Lang.getRef('commands/info/strings/verified', data.lang),
                            value:
                                isVerified !== null
                                    ? '<:success:1335181909751365673>'
                                    : '<:fail:1335182303705563146>',
                            inline: true,
                        },
                        {
                            name: Lang.getRef('commands/info/strings/balance', data.lang),
                            value: balance !== null ? String(balance) : '**-**',
                            inline: true,
                        },
                    ])
                    .setFooter({
                        text: `ID: ${args.user.id}`,
                    });

                InteractionUtils.send(intr, uInfoEmbed);
                break;
            }

            case Lang.getRef('commands/info/subcommands/avatar/name', Language.Default): {
                InteractionUtils.send(intr, {
                    files: [
                        new AttachmentBuilder(args.user.displayAvatarURL(), {
                            name: `${args.user.tag}_${args.user.id}.png`,
                        }),
                    ],
                });
                break;
            }

            case Lang.getRef('commands/info/subcommands/icon/name', Language.Default): {
                if (!intr.guild.iconURL()) {
                    const noIconGuildEmbed = new EmbedBuilder()
                        .setColor('#111213')
                        .setDescription(
                            Lang.getRef('commands/info/strings/noGuildIcon', data.lang)
                        );
                    InteractionUtils.send(intr, noIconGuildEmbed);
                    return;
                }

                InteractionUtils.send(intr, {
                    files: [
                        new AttachmentBuilder(intr.guild.iconURL(), {
                            name: `${intr.guild.name}_${intr.guild.id}.png`,
                        }),
                    ],
                });
                break;
            }

            default: {
                return;
            }
        }
    }
}
