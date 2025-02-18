import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    //PermissionFlagsBits,
    //PermissionsBitField,
    InteractionContextType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord.js';

import { Args } from './index.js';
import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export const ChatCommandMetadata: {
    [command: string]: RESTPostAPIChatInputApplicationCommandsJSONBody;
} = {
    CURRENCY: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('commands/currency/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/currency/name'),
        description: Lang.getRef('commands/currency/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/currency/description'),
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/currency/subcommands/balance/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/balance/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/balance/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/balance/description'
                ),
                options: [
                    {
                        ...Args.CURRENCY_BALANCE_USER,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/currency/subcommands/backpack/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/backpack/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/backpack/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/backpack/description'
                ),
                options: [
                    {
                        ...Args.CURRENCY_BACKPACK_USER,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef(
                    'commands/currency/subcommands/leaderboard/subsubcommands/list/name',
                    Language.Default
                ),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/leaderboard/subsubcommands/list/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/leaderboard/subsubcommands/list/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/leaderboard/subsubcommands/list/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef(
                    'commands/currency/subcommands/leaderboard/subsubcommands/anonymous/name',
                    Language.Default
                ),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/leaderboard/subsubcommands/anonymous/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/leaderboard/subsubcommands/anonymous/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/leaderboard/subsubcommands/anonymous/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/currency/subcommands/sell/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/sell/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/sell/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/sell/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/currency/subcommands/shop/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/shop/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/shop/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/shop/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/currency/subcommands/transfer/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/transfer/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/transfer/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/transfer/description'
                ),
                options: [
                    {
                        ...Args.CURRENCY_TRANSFER_USER,
                    },
                    {
                        ...Args.CURRENCY_TRANSFER_AMOUNT,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/currency/subcommands/work/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/work/name'
                ),
                description: Lang.getRef(
                    'commands/currency/subcommands/work/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/currency/subcommands/work/description'
                ),
            },
        ],
    },
    FUN: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('commands/fun/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/fun/name'),
        description: Lang.getRef('commands/fun/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/fun/description'),
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/fun/subcommands/demotivator/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/fun/subcommands/demotivator/name'
                ),
                description: Lang.getRef(
                    'commands/fun/subcommands/demotivator/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/fun/subcommands/demotivator/description'
                ),
                options: [
                    {
                        ...Args.FUN_DEMOTIVATOR_IMAGE,
                    },
                    {
                        ...Args.FUN_DEMOTIVATOR_TEXT,
                    },
                    {
                        ...Args.FUN_DEMOTIVATOR_SUBTEXT,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/fun/subcommands/meme/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/fun/subcommands/meme/name'
                ),
                description: Lang.getRef(
                    'commands/fun/subcommands/meme/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/fun/subcommands/meme/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/fun/subcommands/fact/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/fun/subcommands/fact/name'
                ),
                description: Lang.getRef(
                    'commands/fun/subcommands/fact/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/fun/subcommands/fact/description'
                ),
            },
        ],
    },
    INFO: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('commands/info/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/info/name'),
        description: Lang.getRef('commands/info/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/info/description'),
        contexts: [InteractionContextType.Guild],
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/info/subcommands/guild/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/guild/name'
                ),
                description: Lang.getRef(
                    'commands/info/subcommands/guild/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/guild/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/info/subcommands/user/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/user/name'
                ),
                description: Lang.getRef(
                    'commands/info/subcommands/user/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/user/description'
                ),
                options: [
                    {
                        ...Args.INFO_USER,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/info/subcommands/avatar/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/avatar/name'
                ),
                description: Lang.getRef(
                    'commands/info/subcommands/avatar/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/avatar/description'
                ),
                options: [
                    {
                        ...Args.AVATAR_USER,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/info/subcommands/icon/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/icon/name'
                ),
                description: Lang.getRef(
                    'commands/info/subcommands/icon/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/info/subcommands/icon/description'
                ),
            },
        ],
    },
    ENCODE: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('commands/encode/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/encode/name'),
        description: Lang.getRef('commands/encode/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/encode/description'),
        contexts: [
            InteractionContextType.BotDM,
            InteractionContextType.Guild,
            InteractionContextType.PrivateChannel,
        ],
        integration_types: [0, 1],
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/atbash/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/atbash/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/atbash/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/base64/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/base64/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/base64/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/binary/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/binary/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/binary/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/caesar/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/caesar/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/caesar/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }, { ...Args.ENCODE_SHIFT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/hex/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/hex/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/hex/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/leet/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/leet/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/leet/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/morse/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/morse/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/morse/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/nato/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/nato/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/nato/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/piglatin/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/piglatin/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/piglatin/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/railfence/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/railfence/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/railfence/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }, { ...Args.ENCODE_RAILS }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/reverse/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/reverse/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/reverse/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }, { ...Args.ENCODE_MODE }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/rot13/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/rot13/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/rot13/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/rot47/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/rot47/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/rot47/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/url/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/url/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/url/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/encode/subcommands/vigenere/name', Language.Default),
                description: Lang.getRef(
                    'commands/encode/subcommands/vigenere/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/subcommands/vigenere/description'
                ),
                options: [{ ...Args.ENCODE_TEXT }, { ...Args.ENCODE_KEY }],
            },
        ],
    },
    DECODE: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('commands/decode/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/decode/name'),
        description: Lang.getRef('commands/decode/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/decode/description'),
        contexts: [
            InteractionContextType.BotDM,
            InteractionContextType.Guild,
            InteractionContextType.PrivateChannel,
        ],
        integration_types: [0, 1],
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/base64/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/base64/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/base64/description'
                ),
                options: [{ ...Args.DECODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/binary/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/binary/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/binary/description'
                ),
                options: [{ ...Args.DECODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/caesar/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/caesar/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/caesar/description'
                ),
                options: [{ ...Args.DECODE_TEXT }, { ...Args.DECODE_SHIFT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/hex/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/hex/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/hex/description'
                ),
                options: [{ ...Args.DECODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/morse/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/morse/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/morse/description'
                ),
                options: [{ ...Args.DECODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/piglatin/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/piglatin/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/piglatin/description'
                ),
                options: [{ ...Args.DECODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/railfence/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/railfence/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/railfence/description'
                ),
                options: [{ ...Args.DECODE_TEXT }, { ...Args.DECODE_RAILS }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/url/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/url/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/url/description'
                ),
                options: [{ ...Args.DECODE_TEXT }],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/decode/subcommands/vigenere/name', Language.Default),
                description: Lang.getRef(
                    'commands/decode/subcommands/vigenere/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/decode/subcommands/vigenere/description'
                ),
                options: [{ ...Args.DECODE_TEXT }, { ...Args.DECODE_KEY }],
            },
        ],
    },
    UTILITY: {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getRef('commands/utility/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/utility/name'),
        description: Lang.getRef('commands/utility/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/utility/description'),
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/utility/subcommands/luck/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/luck/name'
                ),
                description: Lang.getRef(
                    'commands/utility/subcommands/luck/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/luck/description'
                ),
                options: [
                    {
                        ...Args.LUCK_VALUE_1,
                    },
                    {
                        ...Args.LUCK_VALUE_2,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/utility/subcommands/cat/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/cat/name'
                ),
                description: Lang.getRef(
                    'commands/utility/subcommands/cat/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/cat/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/utility/subcommands/dog/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/dog/name'
                ),
                description: Lang.getRef(
                    'commands/utility/subcommands/dog/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/dog/description'
                ),
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: Lang.getRef('commands/utility/subcommands/ben/name', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/ben/name'
                ),
                description: Lang.getRef(
                    'commands/utility/subcommands/ben/description',
                    Language.Default
                ),
                description_localizations: Lang.getRefLocalizationMap(
                    'commands/utility/subcommands/ben/description'
                ),
                options: [
                    {
                        ...Args.UTILITY_BEN_QUESTION,
                    },
                ],
            },
        ],
    },
};

export const MessageCommandMetadata: {
    [command: string]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
} = {};

export const UserCommandMetadata: {
    [command: string]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
} = {};
