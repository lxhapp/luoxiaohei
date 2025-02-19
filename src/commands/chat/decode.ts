import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const MORSE_CODE = {
    A: '.-',
    B: '-...',
    C: '-.-.',
    D: '-..',
    E: '.',
    F: '..-.',
    G: '--.',
    H: '....',
    I: '..',
    J: '.---',
    K: '-.-',
    L: '.-..',
    M: '--',
    N: '-.',
    O: '---',
    P: '.--.',
    Q: '--.-',
    R: '.-.',
    S: '...',
    T: '-',
    U: '..-',
    V: '...-',
    W: '.--',
    X: '-..-',
    Y: '-.--',
    Z: '--..',
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    ' ': '/',
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    '!': '-.-.--',
    '@': '.--.-.',
};

export class DecodeCommand implements Command {
    public names = [Lang.getRef('commands/decode/name', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public devOnly = false;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const text = intr.options.getString('text', true);
        const subcommand = intr.options.getSubcommand();

        function base64(input: string): string {
            return Buffer.from(input, 'base64').toString('utf-8');
        }

        function binary(input: string): string {
            return input
                .split(' ')
                .map(bin => String.fromCharCode(parseInt(bin, 2)))
                .join('');
        }

        function caesar(input: string, shift: number): string {
            const actualShift = shift;
            return input
                .split('')
                .map(char => {
                    const code = char.charCodeAt(0);
                    if (code >= 65 && code <= 90)
                        return String.fromCharCode(((code - 65 + actualShift) % 26) + 65);
                    if (code >= 97 && code <= 122)
                        return String.fromCharCode(((code - 97 + actualShift) % 26) + 97);
                    return char;
                })
                .join('');
        }

        function hex(input: string): string {
            return (
                input
                    .replace(/\s+/g, '')
                    .match(/.{1,2}/g)
                    ?.map(byte => String.fromCharCode(parseInt(byte, 16)))
                    .join('') || ''
            );
        }

        function morse(input: string): string {
            const reverseMorse = Object.fromEntries(
                Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
            );
            return input
                .split(' ')
                .map(code => reverseMorse[code] || code)
                .join('');
        }

        function piglatin(input: string): string {
            if (!input.endsWith('ay') && !input.endsWith('way')) return input;

            const isCapitalized = input[0] === input[0].toUpperCase();
            input = input.toLowerCase();

            if (input.endsWith('way')) {
                const result = input.slice(0, -3);
                return isCapitalized ? result.charAt(0).toUpperCase() + result.slice(1) : result;
            }

            const withoutAy = input.slice(0, -2);
            const lastVowelIndex = withoutAy.search(/[aeiou]/);
            if (lastVowelIndex === -1) return input;

            const result = withoutAy.slice(lastVowelIndex) + withoutAy.slice(0, lastVowelIndex);
            return isCapitalized ? result.charAt(0).toUpperCase() + result.slice(1) : result;
        }

        function railfence(input: string, rails: number): string {
            const fence = Array(rails)
                .fill('')
                .map(() => Array(input.length).fill(''));
            let rail = 0;
            let direction = 1;

            for (let i = 0; i < input.length; i++) {
                fence[rail][i] = '*';
                rail += direction;
                if (rail === rails - 1 || rail === 0) direction = -direction;
            }

            let index = 0;
            for (let i = 0; i < rails; i++) {
                for (let j = 0; j < input.length; j++) {
                    if (fence[i][j] === '*' && index < input.length) {
                        fence[i][j] = input[index++];
                    }
                }
            }

            let result = '';
            rail = 0;
            direction = 1;
            for (let i = 0; i < input.length; i++) {
                result += fence[rail][i];
                rail += direction;
                if (rail === rails - 1 || rail === 0) direction = -direction;
            }

            return result;
        }

        function url(input: string): string {
            return decodeURIComponent(input);
        }

        function vigenere(input: string, key: string): string {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const normalizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
            if (!normalizedKey) return input;

            return input
                .toUpperCase()
                .split('')
                .map((char, i) => {
                    if (!alphabet.includes(char)) return char;
                    const keyChar = normalizedKey[i % normalizedKey.length];
                    const shift = alphabet.indexOf(keyChar);
                    const newIndex = (alphabet.indexOf(char) + shift + 26) % 26;
                    return alphabet[newIndex];
                })
                .join('');
        }

        function getResult(result: string): {
            embeds: EmbedBuilder[];
            files: { attachment: Buffer; name: string }[];
        } {
            const resultEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(Lang.getRef('commands/encode/strings/encodeSuccess', data.lang))
                .addFields({
                    name: Lang.getRef('commands/encode/strings/encodeResult', data.lang),
                    value: result,
                })
                .setTimestamp();

            return {
                embeds: [resultEmbed],
                files: [{ attachment: Buffer.from(result), name: `${subcommand}.txt` }],
            };
        }

        try {
            switch (subcommand) {
                case Lang.getRef('commands/decode/subcommands/base64/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(base64(text)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/binary/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(binary(text)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/caesar/name', Language.Default): {
                    const shift = intr.options.getInteger('shift', true);
                    await InteractionUtils.send(intr, getResult(caesar(text, shift)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/hex/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(hex(text)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/morse/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(morse(text)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/piglatin/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(piglatin(text)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/railfence/name', Language.Default): {
                    const rails = intr.options.getInteger('rails', true);
                    await InteractionUtils.send(intr, getResult(railfence(text, rails)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/url/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(url(text)));
                    break;
                }

                case Lang.getRef('commands/decode/subcommands/vigenere/name', Language.Default): {
                    const key = intr.options.getString('key', true);
                    await InteractionUtils.send(intr, getResult(vigenere(text, key)));
                    break;
                }
            }
        } catch {
            const errorEmbed = new EmbedBuilder()
                .setColor('#111213')
                .setDescription(Lang.getRef('commands/encode/strings/encodeError', data.lang));
            await InteractionUtils.send(intr, errorEmbed);
        }
    }
}
