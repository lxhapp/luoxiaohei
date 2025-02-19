import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

const supabaseUrl = Config.supabase.url;
const supabaseKey = Config.supabase.key;

export const supabase = createClient(supabaseUrl, supabaseKey);
