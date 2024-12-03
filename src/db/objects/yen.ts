import { supabase } from "../main.js";

const YEN_TABLE = "yen";

class Yen {
  static async create(name: any, description: any, username: any) {
    const { data, error } = await supabase
      .from(YEN_TABLE)
      .insert({ name, description, username })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByName(name: any) {
    const { data, error } = await supabase
      .from(YEN_TABLE)
      .select("*")
      .eq("name", name)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }

  static async incrementUsage(name: string) {
    const { data: currentRecord, error: findError } = await supabase
      .from(YEN_TABLE)
      .select("usage_count")
      .eq("name", name)
      .single();

    if (findError) throw findError;

    const { data, error } = await supabase
      .from(YEN_TABLE)
      .update({ usage_count: (currentRecord.usage_count || 0) + 1 })
      .eq("name", name)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAll() {
    const { data, error } = await supabase.from(YEN_TABLE).select("*");

    if (error) throw error;
    return data;
  }
}

export default Yen;
