import type {
    ClientEvents as DiscordClientEvents,
    ChatInputCommandInteraction,
    Message,
} from 'discord.js';
import type Module from '../Module.js';
import type Command from '../commands/Command.js';
import type Inhibitor from '../inhibitors/Inhibitor.js';
import type Listener from '../listeners/Listener.js';

export interface HandlerEvents {
    load: [mod: Module, isReload: boolean];
    remove: [mod: Module];
}

export interface CommandHandlerEvents extends HandlerEvents {
    commandBlocked: [
        interaction: ChatInputCommandInteraction,
        command: Command,
        reason: string,
    ];
    commandFinished: [
        interaction: ChatInputCommandInteraction,
        command: Command,
        args: any,
        returnValue: any,
    ];
    commandLocked: [message: Message, command: Command];
    commandStarted: [message: Message, command: Command, args: any];
    commandNotFound: [interaction: ChatInputCommandInteraction];
    error: [
        error: Error,
        interaction: ChatInputCommandInteraction,
        command?: Command,
    ];
    load: [command: Command, isReload: boolean];
    interactionBlocked: [
        interaction: ChatInputCommandInteraction,
        reason: string,
    ];
    missingPermissions: [
        interaction: ChatInputCommandInteraction,
        command: Command,
        type: 'user' | 'client',
        missing?: any,
    ];
    remove: [command: Command];
}

export interface InhibitorHandlerEvents extends HandlerEvents {
    remove: [inhibitor: Inhibitor];
    load: [inhibitor: Inhibitor, isReload: boolean];
}

export interface ListenerHandlerEvents extends HandlerEvents {
    remove: [listener: Listener];
    load: [listener: Listener, isReload: boolean];
}

export interface ClientEvents extends DiscordClientEvents {
    structureDebug: [message: string, ...other: any[]];
}
