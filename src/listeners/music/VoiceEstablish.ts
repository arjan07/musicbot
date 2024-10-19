import { Events } from 'discord.js';
import Listener from '../../structure/listeners/Listener.js';

export default class VoiceEstablish extends Listener {
    constructor() {
        super('voiceEstablish', {
            emitter: 'client',
            category: 'music',
            event: Events.ClientReady,
        });
    }

    async exec() {
        for (const musicServer of this.client.musicServers) {
            await musicServer.establishConnection();
        }
    }
}
