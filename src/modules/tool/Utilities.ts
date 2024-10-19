import fs from 'fs';
import Client from '../../structure/Client.js';
import { Snowflake } from 'discord.js';

export default class Utilities {
    static async doesFileExist(filepath: string): Promise<boolean> {
        try {
            await fs.promises.access(filepath, fs.constants.F_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async loadJSON(path: string) {
        const fileUrl = new URL(path, import.meta.url);
        return JSON.parse(await fs.promises.readFile(fileUrl, 'utf8'));
    }

    static getMusicServer(client: Client, guildId: Snowflake) {
        const musicServers = client.musicServers;
        return musicServers.find(
            (musicServer) => musicServer.getGuildId() === guildId,
        );
    }
}
