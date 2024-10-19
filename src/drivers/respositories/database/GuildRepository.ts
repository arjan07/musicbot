import { Pool, RowDataPacket } from 'mysql2/promise';
import LoggerTool from '../../../modules/tool/LoggerTool.js';
import { Snowflake } from 'discord.js';

export default class GuildRepository {
    private readonly database: Pool;

    constructor(database: Pool) {
        this.database = database;
    }

    async updateGuildSongHistory(
        songId: number,
        guildId: Snowflake,
        queuedBy: string | undefined,
    ): Promise<void> {
        try {
            await this.database.query(
                'INSERT INTO SongGuildHistory (SongId, GuildId, QueuedBy) VALUES (?,?,?)',
                [songId, guildId, queuedBy],
            );
        } catch (e) {
            LoggerTool.error(
                `Updating recent history in guild ${guildId} with song id ${songId}${queuedBy ? `, queued by ${queuedBy}` : ''}`,
            );
            throw e;
        }
    }

    async getGuildSongHistory(
        guildId: Snowflake,
        limit = 10,
    ): Promise<SongGuildHistory[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM SongGuildHistory INNER JOIN Song ON SongGuildHistory.SongId = Song.Id WHERE SongGuildHistory.GuildId = ? ORDER BY SongGuildHistory.Id DESC LIMIT ?',
                    [guildId, limit],
                )
                .then(([row]) => row as SongGuildHistory[]);
        } catch (e) {
            LoggerTool.error(`Getting recent history in guild: ${guildId}`);
            throw e;
        }
    }

    async getGuildTrustedRole(
        guildId: Snowflake,
    ): Promise<Snowflake | undefined> {
        try {
            const [row] = await this.database.query<RowDataPacket[]>(
                'SELECT * FROM TrustedRole WHERE GuildId = ?',
                [guildId],
            );
            return row.length === 0
                ? undefined
                : (row[0]['RoleId'] as Snowflake);
        } catch (e) {
            LoggerTool.error(
                `Getting guild trusted role from guild: ${guildId}`,
            );
            throw e;
        }
    }

    async setGuildTrustedRole(
        guildId: Snowflake,
        roleId: Snowflake,
    ): Promise<void> {
        try {
            await this.database.query(
                'INSERT INTO TrustedRole (GuildId, RoleId) VALUES (?,?)',
                [guildId, roleId],
            );
        } catch (e) {
            LoggerTool.error(
                `Setting trusted role ${roleId} for guild ${guildId}`,
            );
            throw e;
        }
    }

    async updateGuildTrustedRole(
        guildId: Snowflake,
        roleId: Snowflake,
    ): Promise<void> {
        try {
            await this.database.query(
                'UPDATE TrustedRole SET RoleId = ? WHERE GuildId = ? ',
                [roleId, guildId],
            );
        } catch (e) {
            LoggerTool.error(
                `Updating trusted role ${roleId} for guild ${guildId}`,
            );
            throw e;
        }
    }

    async clearGuildTrustedRole(guildId: Snowflake): Promise<void> {
        try {
            await this.database.query(
                'DELETE FROM TrustedRole WHERE GuildId = ?',
                [guildId],
            );
        } catch (e) {
            LoggerTool.error(`Clearing trusted role for guild ${guildId}`);
            throw e;
        }
    }

    async clearGuildTrustedRoleByRoleId(roleId: Snowflake): Promise<void> {
        try {
            await this.database.query(
                'DELETE FROM TrustedRole WHERE RoleId = ?',
                [roleId],
            );
        } catch (e) {
            LoggerTool.error(
                `Clearing trusted role for guild by role id ${roleId}`,
            );
            throw e;
        }
    }
}

export interface SongGuildHistory {
    'SongGuildHistory.Id': number;
    SongId: number;
    GuildId: Snowflake;
    QueuedBy: string | null;
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
