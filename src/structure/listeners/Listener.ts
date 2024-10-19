import type EventEmitter from 'events';
import type Category from '../Category.js';
import type Client from '../Client.js';
import Module, { ModuleOptions } from '../Module.js';
import type ListenerHandler from './ListenerHandler.js';

export default class Listener extends Module {
    public declare category: Category<string, Listener>;
    public declare client: Client;
    public declare emitter: string | EventEmitter;
    public declare event: string;
    public declare filepath: string;
    public declare handler: ListenerHandler;
    public declare type: ListenerType;

    public constructor(id: string, options: ListenerOptions) {
        const { category, emitter, event, type = 'on' } = options;

        super(id, { category });
        this.emitter = emitter;
        this.event = event;
        this.type = type;
    }

    public exec(...args: any[]): any {}
}

export default interface Listener extends Module {
    reload(): Promise<Listener>;
    remove(): Listener;
}

export interface ListenerOptions extends ModuleOptions {
    emitter: string | EventEmitter;
    event: string;
    type?: ListenerType;
}

export type ListenerType =
    | 'on'
    | 'once'
    | 'prependListener'
    | 'prependOnceListener';
