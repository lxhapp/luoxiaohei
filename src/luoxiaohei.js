/*

- Luo Xiaohei#3598 :: created by themelishy on Discord.
<=~----------~----------~=>
- LICENSE: MIT
- @Luo Cat - https://github.com/lxhapp
- Discord Luo Cat - https://discord.gg/8pQNPFnBph

*/

import dotenv from "dotenv";
dotenv.config();
import * as locales from "./locales.js";
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
  Events,
} from "discord.js";
import { supabase } from "./db/main.js";

class MainClient extends Client {
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

    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.rest = new REST().setToken(process.env.token);

    this.getLocale = new Collection();
    this.getLocale = function (code, str) {
      if (locales[code] && locales[code][str]) {
        return locales[code][str];
      } else if (locales.en[str]) {
        return locales.en[str];
      } else return str;
    };

    this.currency = new Collection();
    this.supabase = supabase;
  }

  async addBalance(id, amount) {
    try {
      // Check Supabase connection
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

      // Fetch user data
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
        // Create new user
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
        // Update existing user
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
        (file) => file.endsWith(".js") || file.endsWith(".ts")
      );

      for (const file of commandFiles) {
        try {
          const filePath = path.join(commandsPath, file);
          const fileUrl = pathToFileURL(filePath);
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
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of eventFiles) {
      try {
        const filePath = path.join(eventsPath, file);
        const fileUrl = pathToFileURL(filePath);
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

      const data = await this.rest.put(
        Routes.applicationCommands(process.env.clientid),
        { body: commands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands`
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
