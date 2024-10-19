import { Pool } from 'mysql2/promise';
import LoggerTool from '../../../modules/tool/LoggerTool.js';
import { Snowflake } from 'discord.js';

export default class QueueRepository {
    private readonly database: Pool;

    constructor(database: Pool) {
        this.database = database;
    }

    async addToGuildQueue(
        songId: number,
        guildId: Snowflake,
        queuedBy: string,
    ): Promise<void> {
        try {
            await this.database.query(
                'INSERT INTO SongQueue (SongId, GuildId, QueuedBy) VALUES (?,?,?)',
                [songId, guildId, queuedBy],
            );
        } catch (e) {
            LoggerTool.error(
                `Adding Song Id ${songId} to queue in guild ${guildId}`,
            );
            throw e;
        }
    }

    async addAlbumToGuildQueue(
        album: (number | string | null)[][],
    ): Promise<void> {
        try {
            await this.database.query(
                'INSERT INTO SongQueue (SongId, GuildId, QueuedBy) VALUES ?',
                [album],
            );
        } catch (e) {
            LoggerTool.error(`Adding songs ${album} to the queue`);
            throw e;
        }
    }

    async deleteFromGuildQueue(
        songId: number,
        guildId: Snowflake,
    ): Promise<void> {
        try {
            await this.database.query(
                'DELETE FROM SongQueue WHERE SongId = ? AND GuildId = ? LIMIT 1',
                [songId, guildId],
            );
        } catch (e) {
            LoggerTool.error(`Deleted Song Id ${songId} in guild ${guildId}`);
            throw e;
        }
    }

    async clearGuildQueue(guildId: Snowflake): Promise<void> {
        try {
            await this.database.query(
                'DELETE FROM SongQueue WHERE GuildId = ?',
                [guildId],
            );
        } catch (e) {
            LoggerTool.error(`Clearing queue in guild ${guildId}`);
        }
    }

    async searchGuildQueue(guildId: Snowflake): Promise<SongQueue[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM SongQueue INNER JOIN Song ON SongQueue.SongId = Song.Id WHERE SongQueue.GuildId = ? ORDER BY SongQueue.Id',
                    [guildId],
                )
                .then(([row]) => row as SongQueue[]);
        } catch (e) {
            LoggerTool.error(`Getting queue for guild ${guildId}`);
            throw e;
        }
    }

    async getSongFromQueue(
        songId: number,
        guildId: Snowflake,
    ): Promise<SongQueue[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM SongQueue INNER JOIN Song ON SongQueue.SongId = Song.Id WHERE SongQueue.GuildId = ? AND Song.Id = ?',
                    [guildId, songId],
                )
                .then(([row]) => row as SongQueue[]);
        } catch (e) {
            LoggerTool.error(
                `Getting Song Id ${songId} in queue in guild ${guildId}`,
            );
            throw e;
        }
    }
}

export interface SongQueue {
    'SongQueue.Id': number;
    SongId: number;
    GuildId: Snowflake;
    QueuedBy: string;
    Date: Date;
    'Song.Id': number;
    OfficialName: string;
    ArtistName: string;
    Path: string;
    AutoPlay: boolean;
    CanQueue: boolean;
    PlayCount: number;
    AlbumName: string;
    IsAlbum: boolean;
    TrackNumber: number;
    AlbumArtworkUrl: string;
}
