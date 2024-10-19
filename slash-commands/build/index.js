import * as core from '@actions/core';
import { REST, Routes } from 'discord.js';
import { combine } from './combine.js';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

try {
  const clientId = core.getInput('client-id');
  const token = core.getInput('token');

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const root = join(__dirname, '..', '..', 'commands');

  const json = await combine(root);

  const rest = new REST().setToken(token);
  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: Object.values(json) }
  );

  core.setOutput('response', `deployed ${data.length} commands`);
} catch (error) {
  core.setFailed(error.message);
}
