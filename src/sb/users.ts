import { createRequire } from 'node:module';

import { scli } from './index.js';
import { Logger } from '../services/index.js';

const require = createRequire(import.meta.url);
let Logs = require('../../lang/logs.json');
const USERS_TABLE = 'users';

export async function upsertUser(userId: number, balance: number = 0): Promise<any> {
    const { data, error } = await scli
        .from(USERS_TABLE)
        .upsert({ user_id: userId, balance }, { onConflict: 'user_id' });

    if (error) {
        Logger.error(
            Logs.error.supabase.upsertUser
                .replaceAll('{{USER_ID}}', userId.toString())
                .replaceAll('{{BALANCE}}', balance.toString())
        );
        console.error(error);
        return false;
    }
    return data;
}

export async function getUser(userId: number): Promise<any> {
    const { data, error } = await scli.from(USERS_TABLE).select('*').eq('user_id', userId).single();

    if (error && error.code !== 'PGRST116') {
        Logger.error(Logs.error.supabase.getUser.replaceAll('{{USER_ID}}', userId.toString()));
        console.error(error);
        return false;
    }
    return data;
}

export async function updateBalance(userId: number, amount: number): Promise<any> {
    const { data: currentUser, error: findError } = await scli
        .from(USERS_TABLE)
        .select('balance')
        .eq('user_id', userId)
        .single();

    if (findError) {
        Logger.error(
            Logs.error.supabase.updateBalance
                .replaceAll('{{USER_ID}}', userId.toString())
                .replaceAll('{{AMOUNT}}', amount.toString())
        );
        console.error(findError);
        return false;
    }

    const { data, error } = await scli
        .from(USERS_TABLE)
        .update({ balance: (currentUser.balance || 0) + amount })
        .eq('user_id', userId)
        .select();

    if (error) {
        Logger.error(
            Logs.error.supabase.updateBalance
                .replaceAll('{{USER_ID}}', userId.toString())
                .replaceAll('{{AMOUNT}}', amount.toString())
        );
        console.error(error);
    }
    return data;
}
