import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord.js';

import { Language } from '../models/enum-helpers/index.js';
import { Lang } from '../services/index.js';

export class Args {
    public static readonly CURRENCY_BALANCE_USER: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.User,
        name: Lang.getRef(
            'commands/currency/subcommands/balance/options/user/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/balance/options/user/name'
        ),
        description: Lang.getRef(
            'commands/currency/subcommands/balance/options/user/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/balance/options/user/description'
        ),
        required: false,
    };

    public static readonly CURRENCY_BACKPACK_USER: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.User,
        name: Lang.getRef(
            'commands/currency/subcommands/backpack/options/user/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/backpack/options/user/name'
        ),
        description: Lang.getRef(
            'commands/currency/subcommands/backpack/options/user/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/backpack/options/user/description'
        ),
        required: false,
    };

    public static readonly CURRENCY_TRANSFER_USER: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.User,
        name: Lang.getRef(
            'commands/currency/subcommands/transfer/options/user/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/transfer/options/user/name'
        ),
        description: Lang.getRef(
            'commands/currency/subcommands/transfer/options/user/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/transfer/options/user/description'
        ),
        required: true,
    };

    public static readonly CURRENCY_TRANSFER_AMOUNT: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.Integer,
        name: Lang.getRef(
            'commands/currency/subcommands/transfer/options/amount/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/transfer/options/amount/name'
        ),
        description: Lang.getRef(
            'commands/currency/subcommands/transfer/options/amount/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/currency/subcommands/transfer/options/amount/description'
        ),
        required: true,
        min_value: 1,
    };

    public static readonly FUN_DEMOTIVATOR_TEXT: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.String,
        name: Lang.getRef(
            'commands/fun/subcommands/demotivator/options/text/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/fun/subcommands/demotivator/options/text/name'
        ),
        description: Lang.getRef(
            'commands/fun/subcommands/demotivator/options/text/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/fun/subcommands/demotivator/options/text/description'
        ),
        required: true,
    };

    public static readonly FUN_DEMOTIVATOR_SUBTEXT: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.String,
        name: Lang.getRef(
            'commands/fun/subcommands/demotivator/options/subtext/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/fun/subcommands/demotivator/options/subtext/name'
        ),
        description: Lang.getRef(
            'commands/fun/subcommands/demotivator/options/subtext/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/fun/subcommands/demotivator/options/subtext/description'
        ),
        required: false,
    };

    public static readonly FUN_DEMOTIVATOR_IMAGE: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.Attachment,
        name: Lang.getRef(
            'commands/fun/subcommands/demotivator/options/image/name',
            Language.Default
        ),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/fun/subcommands/demotivator/options/image/name'
        ),
        description: Lang.getRef(
            'commands/fun/subcommands/demotivator/options/image/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/fun/subcommands/demotivator/options/image/description'
        ),
        required: true,
    };

    public static readonly ENCODE_TEXT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/encode/options/text/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/encode/options/text/name'),
        description: Lang.getRef('commands/encode/options/text/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/encode/options/text/description'
        ),
        type: ApplicationCommandOptionType.String,
        min_length: 1,
        max_length: 4096,
        required: true,
    };

    public static readonly ENCODE_SHIFT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/encode/options/shift/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/encode/options/shift/name'),
        description: Lang.getRef('commands/encode/options/shift/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/encode/options/shift/description'
        ),
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
        max_value: 25,
    };

    public static readonly ENCODE_RAILS: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/encode/options/rails/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/encode/options/rails/name'),
        description: Lang.getRef('commands/encode/options/rails/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/encode/options/rails/description'
        ),
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 2,
        max_value: 10,
    };

    public static readonly ENCODE_MODE: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/encode/options/mode/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/encode/options/mode/name'),
        description: Lang.getRef('commands/encode/options/mode/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/encode/options/mode/description'
        ),
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
            {
                name: Lang.getRef('commands/encode/options/mode/choices/full', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/options/mode/choices/full'
                ),
                value: 'full',
            },
            {
                name: Lang.getRef('commands/encode/options/mode/choices/words', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/options/mode/choices/words'
                ),
                value: 'words',
            },
            {
                name: Lang.getRef('commands/encode/options/mode/choices/letters', Language.Default),
                name_localizations: Lang.getRefLocalizationMap(
                    'commands/encode/options/mode/choices/letters'
                ),
                value: 'letters',
            },
        ],
    };

    public static readonly ENCODE_KEY: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/encode/options/key/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/encode/options/key/name'),
        description: Lang.getRef('commands/encode/options/key/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/encode/options/key/description'
        ),
        type: ApplicationCommandOptionType.String,
        required: true,
    };

    public static readonly DECODE_TEXT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/decode/options/text/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/decode/options/text/name'),
        description: Lang.getRef('commands/decode/options/text/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/decode/options/text/description'
        ),
        type: ApplicationCommandOptionType.String,
        required: true,
    };

    public static readonly DECODE_SHIFT: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/decode/options/shift/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/decode/options/shift/name'),
        description: Lang.getRef('commands/decode/options/shift/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/decode/options/shift/description'
        ),
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 1,
        max_value: 25,
    };

    public static readonly DECODE_RAILS: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/decode/options/rails/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/decode/options/rails/name'),
        description: Lang.getRef('commands/decode/options/rails/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/decode/options/rails/description'
        ),
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 2,
        max_value: 10,
    };

    public static readonly DECODE_KEY: APIApplicationCommandBasicOption = {
        name: Lang.getRef('commands/decode/options/key/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/decode/options/key/name'),
        description: Lang.getRef('commands/decode/options/key/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/decode/options/key/description'
        ),
        type: ApplicationCommandOptionType.String,
        required: true,
    };

    public static readonly INFO_USER: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.User,
        name: Lang.getRef('commands/info/subcommands/user/options/user/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/info/subcommands/user/options/user/name'
        ),
        description: Lang.getRef(
            'commands/info/subcommands/user/options/user/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/info/subcommands/user/options/user/description'
        ),
        required: false,
    };

    public static readonly AVATAR_USER: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.User,
        name: Lang.getRef('commands/info/subcommands/avatar/options/user/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap(
            'commands/info/subcommands/avatar/options/user/name'
        ),
        description: Lang.getRef(
            'commands/info/subcommands/avatar/options/user/description',
            Language.Default
        ),
        description_localizations: Lang.getRefLocalizationMap(
            'commands/info/subcommands/avatar/options/user/description'
        ),
        required: false,
    };

    public static readonly UTILITY_BEN_QUESTION: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.String,
        name: Lang.getRef('commands/utility/subcommands/ben/options/question/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/utility/subcommands/ben/options/question/name'),
        description: Lang.getRef('commands/utility/subcommands/ben/options/question/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/utility/subcommands/ben/options/question/description'),
        required: true
    };
    
    public static readonly LUCK_VALUE_1: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.Integer,
        name: Lang.getRef('commands/utility/subcommands/luck/options/1/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/utility/subcommands/luck/options/1/name'),
        description: Lang.getRef('commands/utility/subcommands/luck/options/1/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/utility/subcommands/luck/options/1/description'),
        required: true,
    };
    
    public static readonly LUCK_VALUE_2: APIApplicationCommandBasicOption = {
        type: ApplicationCommandOptionType.Integer,
        name: Lang.getRef('commands/utility/subcommands/luck/options/2/name', Language.Default),
        name_localizations: Lang.getRefLocalizationMap('commands/utility/subcommands/luck/options/2/name'),
        description: Lang.getRef('commands/utility/subcommands/luck/options/2/description', Language.Default),
        description_localizations: Lang.getRefLocalizationMap('commands/utility/subcommands/luck/options/2/description'),
        required: true,
    };
}
