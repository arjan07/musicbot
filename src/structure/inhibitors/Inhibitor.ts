import {
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
} from 'discord.js';
import StructureError from '../utilities/StructureError.js';
import type Category from '../Category.js';
import type Client from '../Client.js';
import Module, { ModuleOptions } from '../Module.js';
import type Command from '../commands/Command.js';
import type InhibitorHandler from './InhibitorHandler.js';

export default class Inhibitor extends Module {
    public declare priority: number;
    public declare category: Category<string, Inhibitor>;
    public declare client: Client;
    public declare filepath: string;
    public declare handler: InhibitorHandler;
    public declare id: string;
    public declare reason: string;
    public declare type: string;

    public constructor(id: string, options?: InhibitorOptions) {
        const {
            category,
            reason = '',
            type = 'post',
            priority = 0,
        } = options ?? {};

        super(id, { category });

        this.reason = reason;
        this.type = type;
        this.priority = priority;
    }

    public exec(
        interaction:
            | ChatInputCommandInteraction
            | ContextMenuCommandInteraction,
        command?: Command,
    ): boolean | Promise<boolean>;
    public exec(
        interaction:
            | ChatInputCommandInteraction
            | ContextMenuCommandInteraction,
        command?: Command,
    ): boolean | Promise<boolean>;
    public exec(
        interaction:
            | ChatInputCommandInteraction
            | ContextMenuCommandInteraction,
        command?: Command,
    ): boolean | Promise<boolean> {
        throw new StructureError(
            'NOT_IMPLEMENTED',
            this.constructor.name,
            'exec',
        );
    }
}

export default interface Inhibitor extends Module {
    reload(): Promise<Inhibitor>;
    remove(): Inhibitor;
}

export interface InhibitorOptions extends ModuleOptions {
    reason?: string;
    type?: 'all' | 'pre' | 'post';
    priority?: number;
}
