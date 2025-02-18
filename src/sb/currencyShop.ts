import { createRequire } from 'node:module';

import { scli } from './index.js';
import { Logger } from '../services/index.js';

const require = createRequire(import.meta.url);
let Logs = require('../../lang/logs.json');
const CURRENCY_SHOP_TABLE = 'currency_shop';

export async function addShopItem(name: string, price: number): Promise<boolean> {
    const { error } = await scli.from(CURRENCY_SHOP_TABLE).insert([{ name, price }]);

    if (error) {
        Logger.error(
            Logs.error.supabase.addShopItem
                .replaceAll('{{NAME}}', name)
                .replaceAll('{{PRICE}}', price.toString())
        );
        console.error(error);
        return false;
    } else {
        return true;
    }
}

export async function getAllShopItems(): Promise<any[] | false> {
    const { data, error } = await scli.from(CURRENCY_SHOP_TABLE).select('*');

    if (error) {
        Logger.error(Logs.error.supabase.getAllShopItems);
        console.error(error);
        return false;
    } else {
        return data;
    }
}

export async function getShopItem(name: string): Promise<any> {
    const { data, error } = await scli
        .from(CURRENCY_SHOP_TABLE)
        .select('*')
        .eq('name', name)
        .single();

    if (error) {
        Logger.error(Logs.error.supabase.getShopItem.replaceAll('{{NAME}}', name));
        console.error(error);
        return false;
    } else {
        return data;
    }
}
