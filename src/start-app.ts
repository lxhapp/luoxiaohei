import { REST } from '@discordjs/rest';
import { ActivityType, Options, Partials } from 'discord.js';
import { createRequire } from 'node:module';

import { Button } from './buttons/index.js';
import {
    CurrencyCommand,
    DecodeCommand,
    EncodeCommand,
    InfoCommand,
    UtilityCommand,
} from './commands/chat/index.js';
import {
    ChatCommandMetadata,
    Command,
    MessageCommandMetadata,
    UserCommandMetadata,
} from './commands/index.js';
import {
    ButtonHandler,
    CommandHandler,
    MessageHandler,
    ReactionHandler,
    TriggerHandler,
} from './events/index.js';
import { CustomClient } from './extensions/index.js';
import { Job } from './jobs/index.js';
import { App } from './models/app.js';
import { Reaction } from './reactions/index.js';
import {
    CommandRegistrationService,
    EventDataService,
    JobService,
    Logger,
} from './services/index.js';
import { Trigger } from './triggers/index.js';

const require = createRequire(import.meta.url);
let Config = require('../config/config.json');
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    let eventDataService = new EventDataService();
    let client = new CustomClient({
        intents: Config.client.intents,
        partials: (Config.client.partials as string[]).map(partial => Partials[partial]),
        makeCache: Options.cacheWithLimits({
            ...Options.DefaultMakeCacheSettings,
            ...Config.client.caches,
        }),
        presence: {
            activities: [
                {
                    name: Config.client.presence.activity.name,
                    type: ActivityType.Custom,
                },
            ],
            status: Config.client.presence.status,
        },
    });

    let commands: Command[] = [
        new CurrencyCommand(),
        new DecodeCommand(),
        new EncodeCommand(),
        new InfoCommand(),
        new UtilityCommand(),
        // Message Context Commands
        // User Context Commands
    ];

    let buttons: Button[] = [];

    let reactions: Reaction[] = [];

    let triggers: Trigger[] = [];

    let commandHandler = new CommandHandler(commands, eventDataService);
    let buttonHandler = new ButtonHandler(buttons, eventDataService);
    let triggerHandler = new TriggerHandler(triggers, eventDataService);
    let messageHandler = new MessageHandler(triggerHandler);
    let reactionHandler = new ReactionHandler(reactions, eventDataService);

    let jobs: Job[] = [];

    let app = new App(
        Config.client.token,
        client,
        messageHandler,
        commandHandler,
        buttonHandler,
        reactionHandler,
        new JobService(jobs)
    );

    if (process.argv[2] == 'commands') {
        try {
            let rest = new REST({ version: '10' }).setToken(Config.client.token);
            let commandRegistrationService = new CommandRegistrationService(rest);
            let localCmds = [
                ...Object.values(ChatCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
                ...Object.values(MessageCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
                ...Object.values(UserCommandMetadata).sort((a, b) => (a.name > b.name ? 1 : -1)),
            ];
            await commandRegistrationService.process(localCmds, process.argv);
        } catch (error) {
            Logger.error(Logs.error.commandAction, error);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        process.exit();
    }

    await app.start();
}

process.on('unhandledRejection', (reason, _promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
