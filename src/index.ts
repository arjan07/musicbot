import MusicBotClient from './client/MusicBotClient.js';
import EnvTool from './modules/tool/EnvTool.js';

const token = EnvTool.getEnvVariable('MUSIC_BOT_DISCORD_TOKEN');

const client = new MusicBotClient({
    token: token,
});

void client.start();
