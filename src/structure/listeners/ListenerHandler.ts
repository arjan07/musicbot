import { Awaitable, Collection } from 'discord.js';
import type EventEmitter from 'events';
import type { ListenerHandlerEvents } from '../types/events.js';
import Listener from './Listener.js';
import Handler, { LoadPredicate, HandlerOptions } from '../Handler.js';
import Client from '../Client.js';
import Category from '../Category.js';
import StructureError from '../utilities/StructureError.js';

export default class ListenerHandler extends Handler {
    public declare categories: Collection<string, Category<string, Listener>>;
    public declare classToHandle: typeof Listener;
    public declare client: Client;
    public declare directory: string;
    public declare emitters: Collection<string, EventEmitter>;
    public declare modules: Collection<string, Listener>;

    public constructor(client: Client, options: HandlerOptions) {
        const {
            directory,
            classToHandle = Listener,
            extensions = ['.js', '.ts'],
            automateCategories,
            loadFilter,
        } = options ?? {};

        if (classToHandle !== Listener) {
            throw new StructureError(
                'INVALID_CLASS_TO_HANDLE',
                classToHandle.name,
                Listener.name,
            );
        }

        super(client, {
            directory,
            classToHandle,
            extensions,
            automateCategories,
            loadFilter,
        });

        this.emitters = new Collection();
        this.emitters.set('client', this.client);
    }

    public addToEmitter(id: string): Listener {
        const listener: Listener = this.modules.get(id.toString())!;
        if (!listener)
            throw new StructureError(
                'MODULE_NOT_FOUND',
                this.classToHandle.name,
                id,
            );

        const emitter: EventEmitter = this.isEventEmitter(listener.emitter)
            ? (listener.emitter as EventEmitter)
            : this.emitters.get(listener.emitter as string)!;
        if (!this.isEventEmitter(emitter))
            throw new StructureError(
                'INVALID_TYPE',
                'emitter',
                'EventEmitter',
                true,
            );

        emitter[listener.type ?? 'on'](listener.event, listener.exec);
        return listener;
    }

    public override register(listener: Listener, filepath?: string): void {
        super.register(listener, filepath);
        listener.exec = listener.exec.bind(listener);
        this.addToEmitter(listener.id);
    }

    public removeFromEmitter(id: string): Listener {
        const listener: Listener = this.modules.get(id.toString())!;
        if (!listener)
            throw new StructureError(
                'MODULE_NOT_FOUND',
                this.classToHandle.name,
                id,
            );

        const emitter: EventEmitter = this.isEventEmitter(listener.emitter)
            ? (listener.emitter as EventEmitter)
            : this.emitters.get(listener.emitter as string)!;
        if (!this.isEventEmitter(emitter))
            throw new StructureError(
                'INVALID_TYPE',
                'emitter',
                'EventEmitter',
                true,
            );

        emitter.removeListener(listener.event, listener.exec);
        return listener;
    }

    public setEmitters(emitters: any): ListenerHandler {
        for (const [key, value] of Object.entries(emitters)) {
            if (!this.isEventEmitter(value))
                throw new StructureError(
                    'INVALID_TYPE',
                    key,
                    'EventEmitter',
                    true,
                );
            this.emitters.set(key, value);
        }

        return this;
    }

    public isEventEmitter(value: any): value is EventEmitter {
        return (
            value &&
            typeof value.on === 'function' &&
            typeof value.emit === 'function'
        );
    }
}

type Events = ListenerHandlerEvents;

export default interface ListenerHandler extends Handler {
    findCategory(name: string): Category<string, Listener>;
    load(thing: string | Listener, isReload?: boolean): Promise<Listener>;
    loadAll(
        directory?: string,
        filter?: LoadPredicate,
    ): Promise<ListenerHandler>;
    reload(id: string): Promise<Listener>;
    reloadAll(): Promise<ListenerHandler>;
    remove(id: string): Listener;
    removeAll(): ListenerHandler;

    on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => Awaitable<void>,
    ): this;
    once<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => Awaitable<void>,
    ): this;
}
