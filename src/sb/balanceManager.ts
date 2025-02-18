import rateLimiter from './class/index.js';
const RateLimiter = new rateLimiter();
import { scli } from './index.js';
let currency = new Map<string, any>();

export async function addBalance(id: string, amount: number): Promise<any> {
    const operationKey = `addBalance:${id}`;

    try {
        return await RateLimiter.execute(operationKey, async () => {
            const { error: connectionError } = await scli
                .from('users')
                .select('count')
                .limit(1)
                .maybeSingle();

            if (connectionError) {
                throw new Error(`Failed to connect to Supabase: ${connectionError.message}`);
            }

            let { data: userData, error: fetchError } = await scli
                .from('users')
                .select('*')
                .eq('user_id', id)
                .maybeSingle();

            if (fetchError) {
                throw new Error(`Failed to fetch user data: ${fetchError.message}`);
            }

            let newBalance: number;
            if (!userData) {
                newBalance = amount;
                const { data, error } = await scli
                    .from('users')
                    .insert({ user_id: id, balance: newBalance })
                    .select()
                    .single();

                if (error) {
                    throw new Error(`Failed to create new user: ${error.message}`);
                }
                userData = data;
            } else {
                newBalance = userData.balance + amount;
                const { data, error } = await scli
                    .from('users')
                    .update({ balance: newBalance })
                    .eq('user_id', id)
                    .select()
                    .single();

                if (error) {
                    throw new Error(`Failed to update user balance: ${error.message}`);
                }
                userData = data;
            }

            currency.set(id, userData);
            return userData;
        });
    } catch (error) {
        console.error('Error in addBalance:', error);
        throw error;
    }
}

export async function getBalance(id: string): Promise<number> {
    try {
        let user = currency.get(id);
        if (!user) {
            const { data, error } = await scli.from('users').select('*').eq('user_id', id).single();

            if (error && error.code !== 'PGRST116') throw error;
            user = data;
            if (user) currency.set(id, user);
        }
        return user ? user.balance : 0;
    } catch (error) {
        console.error('Error in getBalance:', error);
        throw error;
    }
}
