import {
    CommandInteraction,
    EmbedBuilder,
    GuildChannel,
    MessageComponentInteraction,
    ModalSubmitInteraction,
    ThreadChannel,
} from 'discord.js';

import { FormatUtils, InteractionUtils } from './index.js';
import { Command } from '../commands/index.js';
import { Permission } from '../models/enum-helpers/index.js';
import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';

export class CommandUtils {
    public static findCommand(commands: Command[], commandParts: string[]): Command {
        let found = [...commands];
        let closestMatch: Command;
        for (let [index, commandPart] of commandParts.entries()) {
            found = found.filter(command => command.names[index] === commandPart);
            if (found.length === 0) {
                return closestMatch;
            }

            if (found.length === 1) {
                return found[0];
            }

            let exactMatch = found.find(command => command.names.length === index + 1);
            if (exactMatch) {
                closestMatch = exactMatch;
            }
        }
        return closestMatch;
    }

    public static async runChecks(
        command: Command,
        intr: CommandInteraction | MessageComponentInteraction | ModalSubmitInteraction,
        data: EventData
    ): Promise<boolean> {
        if (command.cooldown) {
            let limited = command.cooldown.take(intr.user.id);
            if (limited) {
                const cooldownEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef('other/cooldownHit', data.lang)
                            .replaceAll(
                                '{{AMOUNT}',
                                command.cooldown.amount.toLocaleString(data.lang)
                            )
                            .replaceAll(
                                '{{INTERVAL}}',
                                FormatUtils.duration(command.cooldown.interval, data.lang)
                            )
                    );
                await InteractionUtils.send(intr, cooldownEmbed);
                return false;
            }
        }

        if (
            (intr.channel instanceof GuildChannel || intr.channel instanceof ThreadChannel) &&
            !intr.channel.permissionsFor(intr.client.user).has(command.requireClientPerms)
        ) {
            const missingPermsEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('other/missingClientPerms', data.lang) +
                        '\n' +
                        Lang.getRef('other/missingClientPerms2', data.lang).replaceAll(
                            '{{PERMISSIONS}}',
                            command.requireClientPerms
                                .map(perm => `**${Permission.Data[perm].displayName(data.lang)}**`)
                                .join(', ')
                        )
                );
            await InteractionUtils.send(intr, missingPermsEmbed);
            return false;
        }

        return true;
    }
}
