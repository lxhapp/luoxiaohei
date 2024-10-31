import { supabase } from './main.js';

const USERS_TABLE = 'users';

// Function to create or update a user
async function upsertUser(userId, balance = 0) {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .upsert({ user_id: userId, balance }, 
      { onConflict: 'user_id' });

  if (error) throw error;
  return data;
}

// Function to get a user
async function getUser(userId) {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Function to update a user's balance
async function updateBalance(userId, amount) {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .update({ balance: supabase.raw(`balance + ${amount}`) })
    .eq('user_id', userId)
    .select();

  if (error) throw error;
  return data;
}

export { upsertUser, getUser, updateBalance };
