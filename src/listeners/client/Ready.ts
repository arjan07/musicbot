import { Events } from 'discord.js';
import Listener from '../../structure/listeners/Listener.js';
import LoggerTool from '../../modules/tool/LoggerTool.js';

export default class Ready extends Listener {
    public constructor() {
        super('ready', {
            emitter: 'client',
            category: 'client',
            event: Events.ClientReady,
        });
    }

    public async exec() {
        this.client.apiCommands =
            await this.client.application?.commands.fetch();
        LoggerTool.info(
            `${this.client.user.username} (${this.client.user.id}) has logged in`,
        );
    }
}
