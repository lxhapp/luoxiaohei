import dotenv from "dotenv";
dotenv.config();

import { ShardingManager } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manager = new ShardingManager(path.join(__dirname, "./start.js"), {
  token: process.env.token,
  totalShards: "auto",
  respawn: true,
});

manager.on("shardCreate", (shard) => {
  console.log(`[Shard ${shard.id}] Launched`);
});

manager.spawn().catch(console.error);
