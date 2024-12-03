import { Client, Collection, REST } from "discord.js";
import { SupabaseClient } from "@supabase/supabase-js";

declare module "discord.js" {
  class MainClient extends Client {
    rateLimiter: RateLimiter;
    commands: Collection<string, CommandModule>;
    cooldowns: Collection<string, any>;
    embedColor: string;
    rest: REST;
    getLocale: (code: string, path: string) => string;
    currency: Collection<string, any>;
    supabase: any;

    constructor() {
      super({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        partials: [Partials.Channel],
        presence: {
          activities: [
            {
              name: "meow",
              state: "≽^•⩊•^≼",
              type: ActivityType.Custom,
            },
          ],
          status: "idle",
        },
      });

      this.rateLimiter = new RateLimiter(3, 1000);
      this.commands = new Collection();
      this.cooldowns = new Collection();
      this.embedColor = "#111216";
      this.rest = new REST().setToken(process.env.token || "");

      this.getLocale = (code: string, path: string) => {
        try {
          const parts = path.split(".");

          let current: any = strings;
          for (const part of parts.slice(0, -1)) {
            current = current[part];
            if (!current) return path;
          }

          const translations = current[parts[parts.length - 1]];
          if (!translations) return path;

          return translations[code] || translations.en || path;
        } catch (error) {
          console.error(
            `Locale error for path "${path}" and code "${code}":`,
            error
          );
          return path;
        }
      };

      this.currency = new Collection();
      this.supabase = supabase;
    }
  }

  interface CommandModule {
    data: SlashCommandBuilder | any;
    run: (...args: any[]) => Promise<void>;
  }

  interface EventModule {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
  }
}
