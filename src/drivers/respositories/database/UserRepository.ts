import { Pool } from 'mysql2/promise';
import LoggerTool from '../../../modules/tool/LoggerTool.js';
import { Snowflake } from 'discord.js';

export default class UserRepository {
    private readonly database: Pool;

    constructor(database: Pool) {
        this.database = database;
    }

    async updateUserSongHistory(
        songHistory: (string | number)[][],
    ): Promise<void> {
        try {
            await this.database.query(
                'INSERT INTO SongUserHistory (UserId, SongId) VALUES ?',
                [songHistory],
            );
        } catch (e) {
            LoggerTool.error(`Updating recent history in user ${songHistory}`);
            throw e;
        }
    }

    async getUserSongHistory(
        userId: Snowflake,
        limit = 10,
    ): Promise<SongUserHistory[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM SongUserHistory INNER JOIN Song on SongUserHistory.SongId = Song.Id WHERE SongUserHistory.UserId = ? ORDER BY SongUserHistory.Date DESC LIMIT ?',
                    [userId, limit],
                )
                .then(([row]) => row as SongUserHistory[]);
        } catch (e) {
            LoggerTool.error(`Getting recent history for user: ${userId}`);
            throw e;
        }
    }
}

export interface SongUserHistory {
    'SongUserHistory.Id': number;
    SongId: number;
    UserId: Snowflake;
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
