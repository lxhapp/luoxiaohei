import { ColorResolvable, Locale, LocalizationMap } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

import { Language } from '../models/enum-helpers/index.js';

interface EmbedData {
    author?: { name: string; iconURL?: string; url?: string };
    title?: string;
    url?: string;
    thumbnail?: string;
    description?: string;
    fields?: { name: string; value: string; inline?: boolean }[];
    image?: string;
    footer?: { text?: string; icon?: string };
    timestamp?: boolean;
    color?: ColorResolvable;
}

export class Lang {
    private static join(arr: any[] | string | undefined, separator: string): string {
        if (!arr) return '';
        return Array.isArray(arr) ? arr.join(separator) : arr;
    }

    private static loadLangFile(locale: Locale): any {
        const filePath = path.join(process.cwd(), 'lang', `lang.${locale}.json`);
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        return null;
    }

    public static getRef(
        path: string,
        langCode: Locale,
        variables?: { [name: string]: string }
    ): any {
        let langData = this.loadLangFile(langCode);
        let value = path.split('/').reduce((obj, key) => obj?.[key], langData);

        if (!value) {
            langData = this.loadLangFile(Language.Default);
            value = path.split('/').reduce((obj, key) => obj?.[key], langData);
        }

        if (!value) return path;

        if (variables && typeof value === 'string') {
            Object.entries(variables).forEach(([key, val]) => {
                value = value.replace(new RegExp(`{{${key}}}`, 'g'), val);
            });
        }

        return value;
    }

    public static getRefLocalizationMap(
        path: string,
        variables?: { [name: string]: string }
    ): LocalizationMap {
        const obj = {};
        for (let langCode of Language.Enabled) {
            obj[langCode] = this.getRef(path, langCode, variables);
        }
        return obj;
    }

    public static getRegex(location: string, langCode: Locale): RegExp {
        const pattern = this.getRef(location, langCode);
        try {
            return new RegExp(pattern, 'i');
        } catch {
            return new RegExp('');
        }
    }

    private static replaceVariables(
        text: string | undefined,
        variables?: { [name: string]: string }
    ): string | undefined {
        if (!text || !variables) return text;

        return Object.entries(variables).reduce((str, [key, value]) => {
            return str.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }, text);
    }

    private static replaceVariablesInEmbedData(
        embedData: EmbedData,
        variables?: { [name: string]: string }
    ): EmbedData {
        if (!variables) return embedData;

        return {
            ...embedData,
            author: embedData.author
                ? {
                      ...embedData.author,
                      name: this.replaceVariables(embedData.author.name, variables),
                  }
                : undefined,
            title: this.replaceVariables(embedData.title, variables),
            description: this.replaceVariables(embedData.description, variables),
            fields: embedData.fields?.map(field => ({
                ...field,
                name: this.replaceVariables(field.name, variables),
                value: this.replaceVariables(field.value, variables),
            })),
            footer: embedData.footer
                ? {
                      ...embedData.footer,
                      text: this.replaceVariables(embedData.footer.text, variables),
                  }
                : undefined,
        };
    }
}
