import { Channel, CommandInteractionOptionResolver, Guild, Locale, User } from 'discord.js';

export class EventData {
    constructor(
        public lang: Locale,
        public langGuild: Locale,
        public user?: User,
        public channel?: Channel,
        public guild?: Guild,
        public args?: CommandInteractionOptionResolver
    ) {}
}
