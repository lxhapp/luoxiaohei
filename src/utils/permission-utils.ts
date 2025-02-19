import { Channel, DMChannel, GuildChannel, PermissionFlagsBits, ThreadChannel } from 'discord.js';

export class PermissionUtils {
    public static canSend(channel: Channel, embedLinks: boolean = false): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                return false;
            }

            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                ...(embedLinks ? [PermissionFlagsBits.EmbedLinks] : []),
            ]);
        } else {
            return false;
        }
    }

    public static canMention(channel: Channel): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                return false;
            }

            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.MentionEveryone,
            ]);
        } else {
            return false;
        }
    }

    public static canReact(channel: Channel, removeOthers: boolean = false): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                return false;
            }

            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.AddReactions,
                PermissionFlagsBits.ReadMessageHistory,
                ...(removeOthers ? [PermissionFlagsBits.ManageMessages] : []),
            ]);
        } else {
            return false;
        }
    }

    public static canPin(channel: Channel, findOld: boolean = false): boolean {
        if (channel instanceof DMChannel) {
            return true;
        } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                return false;
            }
            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ManageMessages,
                ...(findOld ? [PermissionFlagsBits.ReadMessageHistory] : []),
            ]);
        } else {
            return false;
        }
    }

    public static canCreateThreads(
        channel: Channel,
        manageThreads: boolean = false,
        findOld: boolean = false
    ): boolean {
        if (channel instanceof DMChannel) {
            return false;
        } else if (channel instanceof GuildChannel || channel instanceof ThreadChannel) {
            let channelPerms = channel.permissionsFor(channel.client.user);
            if (!channelPerms) {
                return false;
            }

            return channelPerms.has([
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessagesInThreads,
                PermissionFlagsBits.CreatePublicThreads,
                ...(manageThreads ? [PermissionFlagsBits.ManageThreads] : []),
                ...(findOld ? [PermissionFlagsBits.ReadMessageHistory] : []),
            ]);
        } else {
            return false;
        }
    }
}
