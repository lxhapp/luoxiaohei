import axios from 'axios';
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionsString,
} from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

export class FunCommand implements Command {
    public names = [Lang.getRef('commands/fun/name', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public devOnly = false;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const subcommand = intr.options.getSubcommand();

        switch (subcommand) {
            case Lang.getRef('commands/fun/subcommands/demotivator/name', Language.Default): {
                await this.executeDemotivator(intr, data);
                break;
            }
            case Lang.getRef('commands/fun/subcommands/meme/name', Language.Default): {
                await this.executeMeme(intr, data);
                break;
            }
            case Lang.getRef('commands/fun/subcommands/fact/name', Language.Default): {
                await this.executeFact(intr, data);
                break;
            }

            default:
                return;
        }
    }

    private async executeDemotivator(
        intr: ChatInputCommandInteraction,
        data: EventData
    ): Promise<void> {
        const text = intr.options.getString('text', true);
        const subtext = intr.options.getString('subtext', false) || '';
        const uploadedImage = intr.options.getAttachment('image', true);

        if (!uploadedImage.contentType?.startsWith('image/')) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef(
                        'commands/fun/subcommands/demotivator/strings/invalidImage',
                        data.lang
                    )
                );
            await InteractionUtils.send(intr, errorEmbed);
            return;
        }

        try {
            const canvas = createCanvas(800, 800);
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const image = await loadImage(uploadedImage.url);
            const borderSize = Math.min(canvas.width - 100, canvas.height - 250);
            const x = (canvas.width - borderSize) / 2;
            const y = (canvas.height - borderSize - 150) / 2;

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - 10, y - 10, borderSize + 20, borderSize + 20);

            ctx.drawImage(image, x, y, borderSize, borderSize);

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            let fontSize = 48;
            let subtextSize = fontSize * 0.6;
            ctx.font = `${fontSize}px Times New Roman`;

            const textLines = this.wrapText(ctx, text, canvas.width - 120);
            let totalHeight = 0;
            textLines.forEach((line, i) => {
                ctx.fillText(line, canvas.width / 2, y + borderSize + 40 + i * fontSize * 1.2);
                totalHeight = (i + 1) * fontSize * 1.2;
            });

            if (subtext) {
                ctx.font = `${subtextSize}px Times New Roman`;
                const subtextLines = this.wrapText(ctx, subtext, canvas.width - 120);
                subtextLines.forEach((line, i) => {
                    ctx.fillText(
                        line,
                        canvas.width / 2,
                        y + borderSize + 40 + totalHeight + i * subtextSize * 1.2
                    );
                });
            }

            const resultAttachment = new AttachmentBuilder(canvas.toBuffer(), {
                name: 'demotivator.png',
            });

            const successEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('commands/fun/subcommands/demotivator/strings/success', data.lang)
                )
                .setImage('attachment://demotivator.png');

            await InteractionUtils.send(intr, {
                embeds: [successEmbed],
                files: [resultAttachment],
            });
        } catch {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('commands/fun/subcommands/demotivator/strings/error', data.lang)
                );
            await InteractionUtils.send(intr, errorEmbed);
        }
    }

    private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    private async executeMeme(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;

            if (meme.nsfw) {
                const nsfwEmbed = new EmbedBuilder()
                    .setColor('#111213')
                    .setDescription(
                        Lang.getRef('commands/fun/subcommands/meme/strings/nsfwContent', data.lang)
                    );
                await InteractionUtils.send(intr, nsfwEmbed);
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#111213')
                .setURL(meme.postLink)
                .setTitle(meme.title)
                .setDescription(
                    Lang.getRef('commands/fun/subcommands/meme/strings/description', data.lang)
                        .replace('{{AUTHOR}}', meme.author)
                        .replace('{{SUBREDDIT}}', meme.subreddit)
                )
                .setImage(meme.url)
                .setFooter({
                    text: Lang.getRef(
                        'commands/fun/subcommands/meme/strings/footer',
                        data.lang
                    ).replace('{{UPVOTES}}', meme.ups.toString()),
                })
                .setTimestamp();

            await InteractionUtils.send(intr, embed);
        } catch {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('commands/fun/subcommands/meme/strings/error', data.lang)
                );
            await InteractionUtils.send(intr, errorEmbed);
        }
    }

    private async executeFact(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        try {
            const response = await axios.get('https://api.api-ninjas.com/v1/facts', {
                headers: {
                    'X-Api-Key': '9uDtqyQHdTHJjEmEIrcbCg==vOxsk9livTKn4D1m', // It's not my API key, I've just found someone's else.
                },
            });

            if (!response.data?.[0]?.fact) {
                throw new Error('Invalid response format');
            }

            const embed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription('<:luo:1270401166731382867> ' + response.data[0].fact);

            await InteractionUtils.send(intr, embed);
        } catch {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(
                    Lang.getRef('commands/fun/subcommands/fact/strings/error', data.lang)
                );
            await InteractionUtils.send(intr, errorEmbed);
        }
    }
}
