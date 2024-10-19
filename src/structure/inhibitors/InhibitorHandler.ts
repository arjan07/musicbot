import type { Awaitable, Collection } from 'discord.js';
import type { InhibitorHandlerEvents } from '../types/events.js';
import StructureError from '../utilities/StructureError.js';
import type Category from '../Category';
import type Client from '../Client.js';
import Handler, { HandlerOptions, LoadPredicate } from '../Handler.js';
import type Command from '../commands/Command.js';
import Inhibitor from './Inhibitor.js';
import {
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
} from 'discord.js';

export default class InhibitorHandler extends Handler {
    public declare categories: Collection<string, Category<string, Inhibitor>>;
    public declare classToHandle: typeof Inhibitor;
    public declare client: Client;
    public declare directory: string;
    public declare modules: Collection<string, Inhibitor>;

    public constructor(client: Client, options: HandlerOptions) {
        const {
            directory,
            classToHandle = Inhibitor,
            extensions = ['.js', '.ts'],
            automateCategories,
            loadFilter,
        } = options ?? {};

        if (classToHandle !== Inhibitor) {
            throw new StructureError(
                'INVALID_CLASS_TO_HANDLE',
                classToHandle.name,
                Inhibitor.name,
            );
        }

        super(client, {
            directory,
            classToHandle,
            extensions,
            automateCategories,
            loadFilter,
        });
    }

    public async test(
        type: 'all' | 'pre' | 'post',
        interaction:
            | ChatInputCommandInteraction
            | ContextMenuCommandInteraction,
        command?: Command,
    ) {
        if (!this.modules.size) return null;

        const inhibitors = this.modules.filter((i) => i.type === type);
        if (!inhibitors.size) return null;

        const promises = [];

        for (const inhibitor of inhibitors.values()) {
            promises.push(
                (async () => {
                    let inhibited = inhibitor.exec(interaction, command);
                    if (this.isPromise(inhibited)) inhibited = await inhibited;
                    if (inhibited) return inhibitor;
                    return null;
                })(),
            );
        }

        const inhibitedInhibitors = (await Promise.all(promises)).filter(
            (r) => r,
        ) as Inhibitor[];
        if (!inhibitedInhibitors.length) return null;

        inhibitedInhibitors.sort((a, b) => b.priority - a.priority);
        return inhibitedInhibitors[0].reason;
    }

    public isPromise(value: any): value is Promise<any> {
        return (
            value &&
            typeof value.then === 'function' &&
            typeof value.catch === 'function'
        );
    }
}

type Events = InhibitorHandlerEvents;

export default interface InhibitorHandler extends Handler {
    deregister(inhibitor: Inhibitor): void;
    findCategory(name: string): Category<string, Inhibitor>;
    load(thing: string | Inhibitor): Promise<Inhibitor>;
    loadAll(
        directory?: string,
        filter?: LoadPredicate,
    ): Promise<InhibitorHandler>;
    register(inhibitor: Inhibitor, filepath?: string): void;
    reload(id: string): Promise<Inhibitor>;
    reloadAll(): Promise<InhibitorHandler>;
    remove(id: string): Inhibitor;
    removeAll(): InhibitorHandler;
    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => Awaitable<void>,
    ): this;
    once<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => Awaitable<void>,
    ): this;
}
