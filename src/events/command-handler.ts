import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
    EmbedBuilder,
    NewsChannel,
    TextChannel,
    ThreadChannel,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';

import { EventHandler } from './index.js';
import { Command, CommandDeferType } from '../commands/index.js';
import { DiscordLimits } from '../constants/index.js';
import { EventData } from '../models/internal-models.js';
import { EventDataService, Lang, Logger } from '../services/index.js';
import { CommandUtils, InteractionUtils } from '../utils/index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class CommandHandler implements EventHandler {
    private rateLimiter = new RateLimiter(
        Config.rateLimiting.commands.amount,
        Config.rateLimiting.commands.interval * 1000
    );

    constructor(
        public commands: Command[],
        private eventDataService: EventDataService
    ) {}

    public async process(intr: CommandInteraction | AutocompleteInteraction): Promise<void> {
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }

        let commandParts =
            intr instanceof ChatInputCommandInteraction || intr instanceof AutocompleteInteraction
                ? [
                      intr.commandName,
                      intr.options.getSubcommandGroup(false),
                      intr.options.getSubcommand(false),
                  ].filter(Boolean)
                : [intr.commandName];
        let commandName = commandParts.join(' ');

        let command = CommandUtils.findCommand(this.commands, commandParts);
        if (!command) {
            Logger.error(
                Logs.error.commandNotFound
                    .replaceAll('{INTERACTION_ID}', intr.id)
                    .replaceAll('{COMMAND_NAME}', commandName)
            );
            return;
        }

        if (intr instanceof AutocompleteInteraction) {
            if (!command.autocomplete) {
                Logger.error(
                    Logs.error.autocompleteNotFound
                        .replaceAll('{INTERACTION_ID}', intr.id)
                        .replaceAll('{COMMAND_NAME}', commandName)
                );
                return;
            }

            try {
                let option = intr.options.getFocused(true);
                let choices = await command.autocomplete(intr, option);
                await InteractionUtils.respond(
                    intr,
                    choices?.slice(0, DiscordLimits.CHOICES_PER_AUTOCOMPLETE)
                );
            } catch (error) {
                Logger.error(
                    intr.channel instanceof TextChannel ||
                        intr.channel instanceof NewsChannel ||
                        intr.channel instanceof ThreadChannel
                        ? Logs.error.autocompleteGuild
                              .replaceAll('{INTERACTION_ID}', intr.id)
                              .replaceAll('{OPTION_NAME}', commandName)
                              .replaceAll('{COMMAND_NAME}', commandName)
                              .replaceAll('{USER_TAG}', intr.user.tag)
                              .replaceAll('{USER_ID}', intr.user.id)
                              .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                              .replaceAll('{CHANNEL_ID}', intr.channel.id)
                              .replaceAll('{GUILD_NAME}', intr.guild?.name)
                              .replaceAll('{GUILD_ID}', intr.guild?.id)
                        : Logs.error.autocompleteOther
                              .replaceAll('{INTERACTION_ID}', intr.id)
                              .replaceAll('{OPTION_NAME}', commandName)
                              .replaceAll('{COMMAND_NAME}', commandName)
                              .replaceAll('{USER_TAG}', intr.user.tag)
                              .replaceAll('{USER_ID}', intr.user.id),
                    error
                );
            }
            return;
        }

        let limited = this.rateLimiter.take(intr.user.id);
        if (limited) {
            return;
        }

        switch (command.deferType) {
            case CommandDeferType.PUBLIC: {
                await InteractionUtils.deferReply(intr, false);
                break;
            }
            case CommandDeferType.HIDDEN: {
                await InteractionUtils.deferReply(intr, true);
                break;
            }
        }

        if (command.deferType !== CommandDeferType.NONE && !intr.deferred) {
            return;
        }

        let data = await this.eventDataService.create({
            lang: intr.locale,
            langGuild: intr.guildLocale ?? intr.locale,
            user: intr.user,
            channel: intr.channel,
            guild: intr.guild,
            args: intr instanceof ChatInputCommandInteraction ? intr.options : undefined,
        });

        if (!Config.developers.includes(intr.user.id)) {
            const devEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(Lang.getRef('other/devOnly', data.lang));

            InteractionUtils.send(intr, devEmbed);
            return;
        }

        try {
            let passesChecks = await CommandUtils.runChecks(command, intr, data);
            if (passesChecks) {
                await command.execute(intr, data);
            }
        } catch (error) {
            await this.sendError(intr, data);

            Logger.error(
                intr.channel instanceof TextChannel ||
                    intr.channel instanceof NewsChannel ||
                    intr.channel instanceof ThreadChannel
                    ? Logs.error.commandGuild
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{COMMAND_NAME}', commandName)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id)
                          .replaceAll('{CHANNEL_NAME}', intr.channel.name)
                          .replaceAll('{CHANNEL_ID}', intr.channel.id)
                          .replaceAll('{GUILD_NAME}', intr.guild?.name)
                          .replaceAll('{GUILD_ID}', intr.guild?.id)
                    : Logs.error.commandOther
                          .replaceAll('{INTERACTION_ID}', intr.id)
                          .replaceAll('{COMMAND_NAME}', commandName)
                          .replaceAll('{USER_TAG}', intr.user.tag)
                          .replaceAll('{USER_ID}', intr.user.id),
                error
            );
        }
    }

    private async sendError(intr: CommandInteraction, data: EventData): Promise<void> {
        try {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(Lang.getRef('other/intError', data.lang))
                .addFields(
                    {
                        name: Lang.getRef('other/errorCode', data.lang),
                        value: intr.id,
                    },
                    {
                        name: Lang.getRef('other/guildId', data.lang),
                        value: intr.guild?.id ?? Lang.getRef('other/na', data.lang),
                    },
                    {
                        name: Lang.getRef('other/shardId', data.lang),
                        value: (intr.guild?.shardId ?? 0).toString(),
                    },
                    {
                        name: Lang.getRef('other/reportError', data.lang),
                        value: '**[Luo Cat](<https://discord.gg/8pQNPFnBph>)**',
                    }
                );
            await InteractionUtils.send(intr, errorEmbed);
        } catch {
            //
        }
    }
}
