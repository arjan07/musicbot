import { Pool, RowDataPacket } from 'mysql2/promise';
import LoggerTool from '../../../modules/tool/LoggerTool.js';

export default class SongRepository {
    private readonly database: Pool;

    constructor(database: Pool) {
        this.database = database;
    }

    async getSong(songName: string): Promise<Song | null> {
        try {
            const [row] = await this.database.query<RowDataPacket[]>(
                'SELECT * FROM Song WHERE OfficialName = ? LIMIT 1',
                [songName],
            );
            return row.length > 0 ? (row[0] as Song) : null;
        } catch (e) {
            LoggerTool.error(`Finding song ${songName}`);
            throw e;
        }
    }

    async getRandomSongByArtist(artistName: string): Promise<Song> {
        try {
            const [row] = await this.database.query<RowDataPacket[]>(
                'SELECT * FROM Song WHERE AutoPlay = 1 AND CanQueue = 1 AND ArtistName = ? ORDER BY RAND() LIMIT 1',
                [artistName],
            );
            return row[0] as Song;
        } catch (e) {
            LoggerTool.error('Finding random song');
            throw e;
        }
    }

    async updatePlayCount(songId: number): Promise<void> {
        try {
            await this.database.query(
                'UPDATE Song SET PlayCount = PlayCount + 1 WHERE Id = ?',
                [songId],
            );
        } catch (e) {
            LoggerTool.error(`Updating play count`);
            throw e;
        }
    }

    async getAlbum(albumName: string): Promise<Song[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM Song WHERE AlbumName = ? AND IsAlbum = 1 ORDER BY TrackNumber',
                    [albumName],
                )
                .then(([row]) => row as Song[]);
        } catch (e) {
            LoggerTool.error(`Getting album ${albumName}`);
            throw e;
        }
    }

    async rankSongPlays(limit: number | null = 10): Promise<Song[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM Song WHERE PlayCount > 0 ORDER BY PlayCount DESC LIMIT ?',
                )
                .then(([row]) => row as Song[]);
        } catch (e) {
            LoggerTool.error(`Ranking song plays by limit ${limit}`);
            throw e;
        }
    }

    async getAvailableAlbums(): Promise<Album[]> {
        try {
            return this.database
                .query(
                    'SELECT AlbumName, ArtistName FROM Song WHERE IsAlbum = 1 GROUP BY AlbumName, ArtistName',
                )
                .then(([row]) => row as Album[]);
        } catch (e) {
            LoggerTool.error('Getting available albums');
            throw e;
        }
    }

    async songAutoComplete(songName: string): Promise<Song[]> {
        try {
            return await this.database
                .query(
                    'SELECT * FROM SongName INNER JOIN Song ON SongName.SongId = Song.Id WHERE SongName.Name LIKE ? LIMIT 5',
                    [songName],
                )
                .then(([row]) => row as Song[]);
        } catch (e) {
            LoggerTool.error(`Song autocomplete for value ${songName}`);
            throw e;
        }
    }

    async albumAutoComplete(albumName: string): Promise<Album[]> {
        try {
            return await this.database
                .query(
                    'SELECT DISTINCT `AlbumName`, `ArtistName` FROM Song WHERE `IsAlbum` = ? AND `AlbumName` LIKE ? LIMIT 10',
                    [1, albumName],
                )
                .then(([row]) => row as Album[]);
        } catch (e) {
            LoggerTool.error(`Album autocomplete for value ${albumName}`);
            throw e;
        }
    }
}

export interface Song {
    Id: number;
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

export interface Album {
    AlbumName: string;
    ArtistName: string;
}
