import axios from 'axios';
import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';
const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';

export class UtilityCommand implements Command {
    public names = [Lang.getRef('commands/utility/name', Language.Default)];
    public cooldown = new RateLimiter(1, 6000);
    public deferType = CommandDeferType.PUBLIC;
    public devOnly = false;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const subcommand = intr.options.getSubcommand();

        switch (subcommand) {
            case Lang.getRef('commands/utility/subcommands/cat/name', Language.Default): {
                await this.executeCat(intr, data);
                break;
            }
            case Lang.getRef('commands/utility/subcommands/dog/name', Language.Default): {
                await this.executeDog(intr, data);
                break;
            }
            case Lang.getRef('commands/utility/subcommands/ben/name', Language.Default): {
                await this.executeBen(intr, data, intr.options.getString('question', true));
                break;
            }
            case Lang.getRef('commands/utility/subcommands/luck/name', Language.Default): {
                await this.executeLuck(intr, data);
                break;
            }

            default: {
                return;
            }
        }
    }

    private async executeLuck(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const val1 = intr.options.getInteger('first', true);
        const val2 = intr.options.getInteger('second', true);

        const random = this.getRandom(Math.min(val1, val2), Math.max(val1, val2));
        const result = this.getRandom(Math.min(val1, val2), Math.max(val1, val2));

        const luckEmbed = new EmbedBuilder()
            .setColor('#111213')
            .setAuthor({
                name: intr.user.username,
                iconURL: intr.user.displayAvatarURL(),
            })
            .addFields({
                name: Lang.getRef('commands/utility/subcommands/luck/strings/random', data.lang),
                value: `${random}`,
                inline: true,
            })
            .addFields({
                name: Lang.getRef('commands/utility/subcommands/luck/strings/result', data.lang),
                value: `${result}`,
                inline: true,
            });

        if (random === result) {
            luckEmbed.setDescription(
                Lang.getRef('commands/utility/subcommands/luck/strings/lucky', data.lang)
            );
        } else {
            luckEmbed.setDescription(
                Lang.getRef('commands/utility/subcommands/luck/strings/unlucky', data.lang)
            );
        }

        await InteractionUtils.send(intr, luckEmbed);
    }

    private getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private async executeDog(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const dogEmbed = new EmbedBuilder().setColor('#111213');

        try {
            const response = await axios.get(DOG_API_URL);
            const body = response.data;

            if (typeof body === 'object' && body.message) {
                dogEmbed
                    .setImage(body.message)
                    .setTitle(
                        Lang.getRef('commands/utility/subcommands/dog/strings/title', data.lang)
                    )
                    .setTimestamp()
                    .setAuthor({
                        name: intr.user.username,
                        iconURL: intr.user.displayAvatarURL(),
                    });
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error in dog command:', error);
            dogEmbed.setDescription(
                Lang.getRef('commands/utility/subcommands/dog/strings/error', data.lang)
            );
        }

        await InteractionUtils.send(intr, dogEmbed);
    }

    private async executeBen(
        intr: ChatInputCommandInteraction,
        data: EventData,
        question: string
    ): Promise<void> {
        const words = [
            Lang.getRef('commands/utility/subcommands/ben/strings/yes', data.lang),
            Lang.getRef('commands/utility/subcommands/ben/strings/no', data.lang),
            Lang.getRef('commands/utility/subcommands/ben/strings/eugh', data.lang),
            Lang.getRef('commands/utility/subcommands/ben/strings/laugh', data.lang),
        ];

        const response = words[Math.floor(Math.random() * words.length)];

        const answerEmbed = new EmbedBuilder()
            .setColor('#111213')
            .setThumbnail(
                'https://static.wikia.nocookie.net/outfit7talkingfriends/images/8/80/Talking_Ben_the_Dog_Original_HD_Icon.png'
            )
            .addFields({
                name: intr.user.displayName,
                value: question,
                inline: true,
            })
            .addFields({
                name: Lang.getRef('commands/utility/subcommands/ben/strings/name', data.lang),
                value: response,
                inline: true,
            });

        await InteractionUtils.send(intr, answerEmbed);
    }

    private async executeCat(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const catEmbed = new EmbedBuilder().setColor('#111213');

        try {
            const response = await axios.get(CAT_API_URL);
            const body = response.data;

            if (Array.isArray(body)) {
                const catObject = body[0];
                catEmbed
                    .setImage(catObject.url)
                    .setTitle(
                        Lang.getRef('commands/utility/subcommands/cat/strings/title', data.lang)
                    )
                    .setTimestamp()
                    .setAuthor({
                        name: intr.user.username,
                        iconURL: intr.user.displayAvatarURL(),
                    });
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error in cat command:', error);
            catEmbed.setDescription(
                Lang.getRef('commands/utility/subcommands/cat/strings/error', data.lang)
            );
        }

        await InteractionUtils.send(intr, catEmbed);
    }
}
