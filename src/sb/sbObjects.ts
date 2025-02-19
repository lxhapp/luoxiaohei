import { createRequire } from 'node:module';

import { scli } from './index.js';
import { Logger } from '../services/index.js';

const require = createRequire(import.meta.url);
let Logs = require('../../lang/logs.json');
const USERS_TABLE = 'users';
const CURRENCY_SHOP_TABLE = 'currency_shop';
const USER_ITEMS_TABLE = 'user_items';

export async function addItem(userId: number, itemId: number): Promise<any> {
    const { data: existingItem, error: fetchError } = await scli
        .from(USER_ITEMS_TABLE)
        .select('*')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        Logger.error(
            Logs.error.supabase.addItem
                .replaceAll('{{USER_ID}}', userId.toString())
                .replaceAll('{{ITEM_ID}}', itemId.toString())
        );
        console.error(fetchError);
        return false;
    }

    if (existingItem) {
        const { data, error } = await scli
            .from(USER_ITEMS_TABLE)
            .update({ amount: existingItem.amount + 1 })
            .eq('user_id', userId)
            .eq('item_id', itemId);

        if (error) {
            Logger.error(
                Logs.error.supabase.addItem
                    .replaceAll('{{USER_ID}}', userId.toString())
                    .replaceAll('{{ITEM_ID}}', itemId.toString())
            );
            console.error(error);
            return false;
        }
        return data;
    } else {
        const { data, error } = await scli
            .from(USER_ITEMS_TABLE)
            .insert({ user_id: userId, item_id: itemId, amount: 1 });

        if (error) {
            Logger.error(
                Logs.error.supabase.addItem
                    .replaceAll('{{USER_ID}}', userId.toString())
                    .replaceAll('{{ITEM_ID}}', itemId.toString())
            );
            console.error(error);
            return false;
        }
        return data;
    }
}

export async function getItems(userId: number): Promise<any> {
    const { data, error } = await scli
        .from(USER_ITEMS_TABLE)
        .select(
            `
        *,
        item:${CURRENCY_SHOP_TABLE}(*)
      `
        )
        .eq('user_id', userId);

    if (error) {
        Logger.error(Logs.error.supabase.getItems.replaceAll('{{USER_ID}}', userId.toString()));
        console.error(error);
        return false;
    }
    return data;
}

export async function ensureDatabaseSchema(): Promise<boolean> {
    try {
        const { data: userColumns, error: userColumnsError } = await scli.rpc('get_table_columns', {
            table_name: USERS_TABLE,
        });

        if (userColumnsError) {
            Logger.error(Logs.error.supabase.ensureDatabaseSchema);
            console.error(userColumnsError);
            return false;
        }

        if (!userColumns.find((col: { column_name: string }) => col.column_name === 'new_column')) {
            const { error: alterError } = await scli.rpc('add_column_if_not_exists', {
                table_name: USERS_TABLE,
                column_name: 'new_column',
                column_type: 'TEXT',
            });

            if (alterError) {
                Logger.error(Logs.error.supabase.ensureDatabaseSchema);
                console.error(alterError);
                return false;
            }
        }

        console.log('Database schema ensured successfully');
        return true;
    } catch (error) {
        console.error('Error during database schema check:', error);
        return false;
    }
}
