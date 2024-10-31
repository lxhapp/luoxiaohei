import { supabase } from "../main.js";

const YEN_TABLE = 'yen';

class Yen {
  static async create(name, description, username) {
    const { data, error } = await supabase
      .from(YEN_TABLE)
      .insert({ name, description, username })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByName(name) {
    const { data, error } = await supabase
      .from(YEN_TABLE)
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async incrementUsage(name) {
    const { data, error } = await supabase
      .from(YEN_TABLE)
      .update({ usage_count: supabase.raw('usage_count + 1') })
      .eq('name', name)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAll() {
    const { data, error } = await supabase
      .from(YEN_TABLE)
      .select('*');

    if (error) throw error;
    return data;
  }
}

export default Yen;
