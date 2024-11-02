import dotenv from "dotenv";
dotenv.config();

import { ShardingManager } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manager = new ShardingManager(path.join(__dirname, "./src/start.js"), {
  token: process.env.token,
  totalShards: "auto",
  respawn: true,
});

// Handle shard events
manager.on("shardCreate", (shard) => {
  console.log(`[Shard ${shard.id}] Launched`);
});

// Error handling
manager.on("shardError", (shard, error) => {
  console.error(`[Shard ${shard.id}] Error:`, error);
});

manager.spawn().catch(console.error);
