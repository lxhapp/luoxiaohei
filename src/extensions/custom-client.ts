import { ActivityType, Client, ClientOptions, Presence, PresenceData } from 'discord.js';

export class CustomClient extends Client {
    constructor(clientOptions: ClientOptions) {
        super(clientOptions);
    }

    public setPresence(
        type: Exclude<ActivityType, ActivityType.Custom>,
        name: string,
        state: string = name,
        url: string = 'https://youtube.com/dQw4w9WgXcQ',
        status: Exclude<PresenceData['status'], 'dnd' | 'idle'> = 'online'
    ): Presence {
        return this.user?.setPresence({
            activities: [
                {
                    type,
                    name,
                    state,
                    url,
                },
            ],
            status: status,
        });
    }
}
