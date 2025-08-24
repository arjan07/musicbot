import * as core from '@actions/core';
import { REST, Routes } from 'discord.js';
import { combine } from './combine.js';
import { dirname, join } from "path";
import { fileURLToPath } from "url";

try {
  const clientId = core.getInput('client-id');
  const token = core.getInput('token');
  const dryRun = core.getInput('dry-run') === 'true';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const root = join(__dirname, '..', '..', 'commands');

  const json = await combine(root);

  if (dryRun) {
    core.info('Dry run: skipping actual API call.');
    core.info(`Would deploy ${Object.keys(json).length} commands:`);
    core.info(JSON.stringify(json, null, 2));

    core.setOutput('response', `dry run - would deploy ${Object.keys(json).length} commands`);
    process.exit(0);
  }

  const rest = new REST().setToken(token);
  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: Object.values(json) }
  );

  core.setOutput('response', `deployed ${data.length} commands.`);
} catch (error) {
  core.setFailed(error.message);
}
