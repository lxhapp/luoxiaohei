/*

- Luo Xiaohei#3598 :: created by themelishy on Discord.
<=~----------~----------~=>
- LICENSE: MIT
- @Luo Cat - https://github.com/lxhapp
- Discord Luo Cat - https://discord.gg/8pQNPFnBph

*/

import dotenv from "dotenv";
dotenv.config();
import strings from "./strings.js";
import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { supabase } from "./db/main.js";

import RateLimiter from "./class/rate-limiter.js";

class MainClient extends Client {
  rateLimiter: RateLimiter;
  commands: Collection<string, any>;
  cooldowns: Collection<string, any>;
  embedColor: string;
  rest: REST;
  getLocale: (code: string, path: string) => string;
  currency: Map<string, any>;
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
    this.rest = new REST().setToken(process.env.token);

    this.getLocale = function (code: string, path: string) {
      try {
        const parts = path.split(".");

        let current = strings;
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

  async addBalance(id: string, amount: number) {
    const operationKey = `addBalance:${id}`;

    try {
      return await this.rateLimiter.execute(operationKey, async () => {
        const { error: connectionError } = await this.supabase
          .from("users")
          .select("count")
          .limit(1)
          .maybeSingle();

        if (connectionError) {
          throw new Error(
            `Failed to connect to Supabase: ${connectionError.message}`
          );
        }

        let { data: userData, error: fetchError } = await this.supabase
          .from("users")
          .select("*")
          .eq("user_id", id)
          .maybeSingle();

        if (fetchError) {
          throw new Error(`Failed to fetch user data: ${fetchError.message}`);
        }

        let newBalance;
        if (!userData) {
          newBalance = amount;
          const { data, error } = await this.supabase
            .from("users")
            .insert({ user_id: id, balance: newBalance })
            .select()
            .single();

          if (error) {
            throw new Error(`Failed to create new user: ${error.message}`);
          }
          userData = data;
        } else {
          newBalance = userData.balance + amount;
          const { data, error } = await this.supabase
            .from("users")
            .update({ balance: newBalance })
            .eq("user_id", id)
            .select()
            .single();

          if (error) {
            throw new Error(`Failed to update user balance: ${error.message}`);
          }
          userData = data;
        }

        this.currency.set(id, userData);
        return userData;
      });
    } catch (error) {
      console.error("Error in addBalance:", error);
      throw error;
    }
  }

  async getBalance(id) {
    try {
      let user = this.currency.get(id);
      if (!user) {
        const { data, error } = await this.supabase
          .from("users")
          .select("*")
          .eq("user_id", id)
          .single();

        if (error && error.code !== "PGRST116") throw error;
        user = data;
        if (user) this.currency.set(id, user);
      }
      return user ? user.balance : 0;
    } catch (error) {
      console.error("Error in getBalance:", error);
      throw error;
    }
  }

  async loadCommands() {
    const commands = [];
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const foldersPath = path.join(__dirname, ".", "commands");
    const commandFolders = readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = readdirSync(commandsPath).filter(
        (file) => file.endsWith(".js")
      );

      for (const file of commandFiles) {
        try {
          const filePath = path.join(commandsPath, file);
          const fileUrl = pathToFileURL(filePath).toString();
          const command = await import(fileUrl);

          if ("data" in command && "run" in command) {
            this.commands.set(command.data.name, command);
            commands.push(
              command.data instanceof SlashCommandBuilder
                ? command.data.toJSON()
                : command.data
            );
          } else {
            console.warn(
              `The command at ${filePath} is missing a required "data" or "run" property`
            );
          }
        } catch (error) {
          console.error(`Error loading command from ${file}:`, error);
        }
      }
    }

    return commands;
  }

  async loadEvents() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const eventsPath = path.join(__dirname, ".", "events");
    const eventFiles = readdirSync(eventsPath).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of eventFiles) {
      try {
        const filePath = path.join(eventsPath, file);
        const fileUrl = pathToFileURL(filePath).toString();
        const event = await import(fileUrl);
        if (event.once) {
          this.once(event.name, (...args) => event.execute(...args));
        } else {
          this.on(event.name, (...args) => event.execute(...args));
        }
      } catch (error) {
        console.error(`Error loading event from ${file}:`, error);
      }
    }
  }

  async registerCommands() {
    try {
      const commands = await this.loadCommands();
      console.log(
        `Started refreshing ${commands.length} application (/) commands`
      );

      const data = (await this.rest.put(
        Routes.applicationCommands(process.env.clientid),
        { body: commands }
      )) as any[];

      console.log(
        `Successfully reloaded ${
          (data as any[]).length
        } application (/) commands`
      );
    } catch (error) {
      console.error("Error refreshing application commands:", error);
    }
  }

  async start() {
    await this.loadEvents();
    await this.registerCommands();
    await this.login(process.env.token);
  }
}

export default MainClient;
