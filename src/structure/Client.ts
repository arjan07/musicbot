import {
    ApplicationCommand,
    Awaitable,
    Client as DiscordClient,
    ClientOptions,
    Collection,
    Snowflake,
    UserResolvable,
} from 'discord.js';
import { ClientEvents } from './types/events';
import MySQLDriver from '../drivers/MySQLDriver.js';
import CommandHandler from './commands/CommandHandler';
import MusicServer from '../modules/music/MusicServer';

export default class Client<
    Ready extends boolean = true,
> extends DiscordClient<Ready> {
    public declare commandHandler: CommandHandler;
    public declare ownerId: Snowflake | Snowflake[];
    public declare database: MySQLDriver;
    public declare apiCommands:
        | Collection<string, ApplicationCommand>
        | undefined;
    public declare musicServers: MusicServer[];

    public constructor(options: Options & ClientOptions);
    public constructor(options: Options, clientOptions: ClientOptions);

    public constructor(
        options: (Options & ClientOptions) | Options,
        clientOptions?: ClientOptions,
    ) {
        const combinedOptions = { ...options, ...clientOptions };
        super(combinedOptions as Options & ClientOptions);
        this.ownerId = combinedOptions.ownerId ?? [];
        this.database = combinedOptions.database;
    }

    public isOwner(user: UserResolvable): boolean {
        const id = this.users.resolveId(user);
        if (!id) return false;
        return Array.isArray(this.ownerId)
            ? this.ownerId.includes(id)
            : id === this.ownerId;
    }
}

type Event = ClientEvents;

export default interface Client<Ready extends boolean = true>
    extends DiscordClient<Ready> {
    on<K extends keyof Event>(
        event: K,
        listener: (...args: Event[K]) => Awaitable<void>,
    ): this;
    on<S extends string | symbol>(
        event: Exclude<S, keyof Event>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    once<K extends keyof Event>(
        event: K,
        listener: (...args: Event[K]) => Awaitable<void>,
    ): this;
    once<S extends string | symbol>(
        event: Exclude<S, keyof Event>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    emit<K extends keyof Event>(event: K, ...args: Event[K]): boolean;
    emit<S extends string | symbol>(
        event: Exclude<S, keyof Event>,
        ...args: unknown[]
    ): boolean;

    off<K extends keyof Event>(
        event: K,
        listener: (...args: Event[K]) => Awaitable<void>,
    ): this;
    off<S extends string | symbol>(
        event: Exclude<S, keyof Event>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    removeAllListeners<K extends keyof Event>(event?: K): this;
    removeAllListeners<S extends string | symbol>(
        event?: Exclude<S, keyof Event>,
    ): this;
}

export interface Options {
    ownerId?: Snowflake | Snowflake[];
    database: MySQLDriver;
}
