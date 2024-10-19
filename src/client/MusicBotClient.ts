import { GatewayIntentBits, Partials } from 'discord.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Client from '../structure/Client.js';
import CommandHandler from '../structure/commands/CommandHandler.js';
import ListenerHandler from '../structure/listeners/ListenerHandler.js';
import MySQLDriver from '../drivers/MySQLDriver.js';
import EnvTool from '../modules/tool/EnvTool.js';
import Utilities from '../modules/tool/Utilities.js';
import MusicServer, {
    MusicServerInterface,
} from '../modules/music/MusicServer.js';
const musicServers = await Utilities.loadJSON('../../../music-servers.json');

interface MusicBotOptions {
    token?: string;
}

const ownerId = EnvTool.getEnvVariable('MUSIC_BOT_OWNER_ID');

export default class MusicBotClient extends Client {
    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(
            dirname(fileURLToPath(import.meta.url)),
            '..',
            'commands',
        ),
        blockBots: true,
        blockClient: true,
        automateCategories: true,
        ignorePermissions: [ownerId],
    });

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(
            dirname(fileURLToPath(import.meta.url)),
            '..',
            'listeners',
        ),
    });

    public config: MusicBotOptions;

    public constructor(config: MusicBotOptions) {
        super({
            ownerId: ownerId,
            database: new MySQLDriver(),
            allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildVoiceStates,
            ],
            partials: [Partials.User, Partials.Channel, Partials.GuildMember],
        });

        this.config = config;
        this.apiCommands = undefined;
        this.musicServers = musicServers.map(
            (musicServer: MusicServerInterface) =>
                new MusicServer(
                    this,
                    musicServer.rootFilepath,
                    musicServer.primaryArtist,
                    musicServer.voiceChannelId,
                    musicServer.stageChannelId,
                    musicServer.guildId,
                ),
        );
    }

    private async _init(): Promise<void> {
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });

        await this.commandHandler.loadAll();
        await this.listenerHandler.loadAll();
    }

    public async start(): Promise<string> {
        await this._init();
        return this.login(this.config.token);
    }
}
