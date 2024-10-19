import { createPool, Pool } from 'mysql2/promise';
import EnvTool from '../modules/tool/EnvTool.js';
import SongRepository from './respositories/database/SongRepository.js';
import QueueRepository from './respositories/database/QueueRepository.js';
import GuildRepository from './respositories/database/GuildRepository.js';
import UserRepository from './respositories/database/UserRepository.js';

const username = EnvTool.getEnvVariable('MUSIC_BOT_DB_USERNAME');
const password = EnvTool.getEnvVariable('MUSIC_BOT_DB_PASSWORD');
const host = EnvTool.getEnvVariable('MUSIC_BOT_DB_HOST');
const database = EnvTool.getEnvVariable('MUSIC_BOT_DB_NAME');
const port = EnvTool.getEnvVariable('MUSIC_BOT_DB_PORT');
const ca = EnvTool.getEnvVariable('MUSIC_BOT_DB_CA');

export default class MySQLDriver {
    private readonly database: Pool;

    public song: SongRepository;
    public queue: QueueRepository;
    public guild: GuildRepository;
    public user: UserRepository;

    constructor() {
        this.database = createPool({
            user: username,
            password: password,
            host: host,
            database: database,
            port: Number(port),
            waitForConnections: true,
            enableKeepAlive: true,
            connectionLimit: 76,
            idleTimeout: 28800,
            ...(ca && {
                ssl: {
                    ca: ca,
                },
            }),
        });

        this.song = new SongRepository(this.database);
        this.queue = new QueueRepository(this.database);
        this.guild = new GuildRepository(this.database);
        this.user = new UserRepository(this.database);
    }
}
