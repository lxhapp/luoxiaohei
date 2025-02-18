import { ChatInputCommandInteraction, EmbedBuilder, PermissionsString } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';

import { Language } from '../../models/enum-helpers/index.js';
import { EventData } from '../../models/internal-models.js';
import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';

const LEET_MAP = {
    a: '4',
    b: '8',
    e: '3',
    g: '6',
    i: '1',
    l: '1',
    o: '0',
    s: '5',
    t: '7',
    z: '2',
    A: '4',
    B: '8',
    E: '3',
    G: '6',
    I: '1',
    L: '1',
    O: '0',
    S: '5',
    T: '7',
    Z: '2',
};

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

const NATO_ALPHABET = {
    A: 'Alpha',
    B: 'Bravo',
    C: 'Charlie',
    D: 'Delta',
    E: 'Echo',
    F: 'Foxtrot',
    G: 'Golf',
    H: 'Hotel',
    I: 'India',
    J: 'Juliett',
    K: 'Kilo',
    L: 'Lima',
    M: 'Mike',
    N: 'November',
    O: 'Oscar',
    P: 'Papa',
    Q: 'Quebec',
    R: 'Romeo',
    S: 'Sierra',
    T: 'Tango',
    U: 'Uniform',
    V: 'Victor',
    W: 'Whiskey',
    X: 'X-ray',
    Y: 'Yankee',
    Z: 'Zulu',
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
};

export class EncodeCommand implements Command {
    public names = [Lang.getRef('commands/encode/name', Language.Default)];
    public cooldown = new RateLimiter(1, 5000);
    public deferType = CommandDeferType.PUBLIC;
    public devOnly = false;
    public requireClientPerms: PermissionsString[] = [];

    public async execute(intr: ChatInputCommandInteraction, data: EventData): Promise<void> {
        const text = intr.options.getString('text', true);
        const subcommand = intr.options.getSubcommand();

        function atbash(input: string): string {
            return input
                .split('')
                .map(char => {
                    const code = char.charCodeAt(0);
                    if (code >= 65 && code <= 90) return String.fromCharCode(90 - (code - 65));
                    if (code >= 97 && code <= 122) return String.fromCharCode(122 - (code - 97));
                    return char;
                })
                .join('');
        }

        function base64(input: string): string {
            return Buffer.from(input).toString('base64');
        }

        function binary(input: string): string {
            return input
                .split('')
                .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
                .join(' ');
        }

        function caesar(input: string, shift: number): string {
            const actualShift = 26 - shift;
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
            return input
                .split('')
                .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
                .join(' ');
        }

        function leet(input: string): string {
            return input
                .split('')
                .map(char => LEET_MAP[char] || char)
                .join('');
        }

        function morse(input: string): string {
            return input
                .toUpperCase()
                .split('')
                .map(char => MORSE_CODE[char] || char)
                .join(' ');
        }

        function NATO(input: string): string {
            return input
                .toUpperCase()
                .split('')
                .map(char => NATO_ALPHABET[char] || char)
                .join(' ');
        }

        function piglatin(input: string): string {
            const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
            if (!input) return input;

            const isCapitalized = input[0] === input[0].toUpperCase();
            input = input.toLowerCase();

            if (vowels.includes(input[0])) {
                return isCapitalized
                    ? input.charAt(0).toUpperCase() + input.slice(1) + 'way'
                    : input + 'way';
            }

            let vIndex = 0;
            for (let i = 0; i < input.length; i++) {
                if (vowels.includes(input[i])) {
                    vIndex = i;
                    break;
                }
            }

            if (vIndex === 0) vIndex = input.length;

            const result = input.slice(vIndex) + input.slice(0, vIndex) + 'ay';
            return isCapitalized ? result.charAt(0).toUpperCase() + result.slice(1) : result;
        }

        function railfence(input: string, rails: number): string {
            const fence = Array(rails)
                .fill('')
                .map(() => Array(input.length).fill(''));
            let rail = 0;
            let direction = 1;

            for (let i = 0; i < input.length; i++) {
                fence[rail][i] = input[i];
                rail += direction;
                if (rail === rails - 1 || rail === 0) direction = -direction;
            }

            return fence
                .map(row => row.join(''))
                .join('')
                .replace(/\s+/g, '');
        }

        function reverse(input: string, mode: string): string {
            switch (mode) {
                case 'full':
                    return input.split('').reverse().join('');
                case 'words':
                    return input.split(' ').reverse().join(' ');
                case 'letters':
                    return input
                        .split(' ')
                        .map(word => word.split('').reverse().join(''))
                        .join(' ');
                default:
                    return input;
            }
        }

        function rot13(input: string): string {
            return input.replace(/[a-zA-Z]/g, char => {
                const code = char.charCodeAt(0);
                const isUpperCase = char === char.toUpperCase();
                const baseCode = isUpperCase ? 65 : 97;
                return String.fromCharCode(baseCode + ((code - baseCode + 13) % 26));
            });
        }

        function rot47(input: string): string {
            return input
                .split('')
                .map(char => {
                    const code = char.charCodeAt(0);
                    if (code >= 33 && code <= 126) {
                        return String.fromCharCode(33 + ((code + 14) % 94));
                    }
                    return char;
                })
                .join('');
        }

        function url(input: string): string {
            return encodeURIComponent(input);
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
                    const shift = -alphabet.indexOf(keyChar);
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
                case Lang.getRef('commands/encode/subcommands/atbash/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(atbash(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/base64/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(base64(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/binary/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(binary(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/caesar/name', Language.Default): {
                    const shift = intr.options.getInteger('shift', true);
                    await InteractionUtils.send(intr, getResult(caesar(text, shift)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/hex/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(hex(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/leet/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(leet(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/morse/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(morse(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/nato/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(NATO(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/piglatin/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(piglatin(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/railfence/name', Language.Default): {
                    const rails = intr.options.getInteger('rails', true);
                    await InteractionUtils.send(intr, getResult(railfence(text, rails)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/reverse/name', Language.Default): {
                    const mode = intr.options.getString('mode', true);
                    await InteractionUtils.send(intr, getResult(reverse(text, mode)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/rot13/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(rot13(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/rot47/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(rot47(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/url/name', Language.Default): {
                    await InteractionUtils.send(intr, getResult(url(text)));
                    break;
                }

                case Lang.getRef('commands/encode/subcommands/vigenere/name', Language.Default): {
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
