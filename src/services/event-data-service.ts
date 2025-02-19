import {
    Channel,
    CommandInteractionOptionResolver,
    Guild,
    Locale,
    PartialDMChannel,
    User,
} from 'discord.js';

import { Language } from '../models/enum-helpers/language.js';
import { EventData } from '../models/internal-models.js';

export class EventDataService {
    public async create(
        options: {
            user?: User;
            channel?: Channel | PartialDMChannel;
            guild?: Guild;
            args?: Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>;
            lang?: Locale;
            langGuild?: Locale;
        } = {}
    ): Promise<EventData> {
        let lang =
            options.lang ??
            (options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale)
                ? options.guild.preferredLocale
                : Language.Default);

        let langGuild =
            options.langGuild ??
            (options.guild?.preferredLocale &&
            Language.Enabled.includes(options.guild.preferredLocale)
                ? options.guild.preferredLocale
                : Language.Default);

        return new EventData(lang, langGuild);
    }
}
