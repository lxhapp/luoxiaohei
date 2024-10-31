import { Events } from "discord.js";

export const name = Events.MessageCreate;
export const once = false;
export async function execute(message) {
  if (message.author.bot) return;
  const { client } = message;
  try {
    await client.addBalance(message.author.id, 1);
  } catch (error) {
    console.error('Error adding balance:', error);
  }
}
