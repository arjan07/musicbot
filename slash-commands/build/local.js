import { REST, Routes } from 'discord.js';
import { combine } from "./combine.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

try {
  const clientId = process.env.MUSIC_BOT_DISCORD_APPLICATION_ID;
  const token = process.env.MUSIC_BOT_DISCORD_TOKEN;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const root = join(__dirname, '..', 'commands');

  const json = await combine(root);

  const rest = new REST().setToken(token);
  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: Object.values(json) }
  );

  console.log(`Deployed ${data.length} commands`);
} catch (e) {
  console.error(e);
}
