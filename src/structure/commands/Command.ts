import {
    APIApplicationCommandOption,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandInteraction,
    PermissionResolvable,
} from 'discord.js';
import Module, { ModuleOptions } from '../Module.js';
import Category from '../Category.js';
import Client from '../Client.js';
import CommandHandler from './CommandHandler.js';

export default class Command extends Module {
    public declare category: Category<string, Command>;
    public declare guildOnly?: boolean;
    public declare client: Client;
    public declare clientPermissions?:
        | PermissionResolvable
        | PermissionResolvable[];
    public declare userPermissions?:
        | PermissionResolvable
        | PermissionResolvable[]
        | MissingPermissionSupplier;
    public declare description: string;
    public declare deferReply?: boolean;
    public declare usage?: string;
    public declare example?: string;
    public declare ephemeral?: boolean;
    public declare filepath: string;
    public declare handler: CommandHandler;
    public declare id: string;
    public declare name: string;
    public declare ownerOnly?: boolean;
    public declare options?: APIApplicationCommandOption[];

    constructor(id: string, commandOptions?: CommandOptions) {
        super(id, { category: commandOptions?.category });

        const {
            guildOnly = false,
            clientPermissions = this.clientPermissions,
            description,
            deferReply = true,
            usage = null,
            example = null,
            ephemeral = false,
            name,
            ownerOnly = false,
            options = [],
            userPermissions = this.userPermissions,
        } = commandOptions ?? {};

        this.guildOnly = Boolean(guildOnly)!;
        this.clientPermissions = clientPermissions;
        this.description = description!;
        this.deferReply = Boolean(deferReply);
        this.usage = usage!;
        this.example = example!;
        this.ephemeral = Boolean(ephemeral);
        this.name = name!;
        this.ownerOnly = Boolean(ownerOnly);
        this.options = options;
        this.userPermissions =
            typeof userPermissions === 'function'
                ? userPermissions.bind(this)
                : userPermissions;
    }

    public before(interaction: ContextMenuCommandInteraction): any {}
    public exec(interaction: ChatInputCommandInteraction): any {}
    public autocomplete(interaction: AutocompleteInteraction): any {}
}

export type MissingPermissionSupplier = (
    interaction: ChatInputCommandInteraction,
) => Promise<any> | any;

export interface CommandOptions extends ModuleOptions {
    guildOnly?: boolean;
    clientPermissions?: PermissionResolvable | PermissionResolvable[];
    description: string;
    deferReply?: boolean;
    usage?: string;
    example?: string;
    ephemeral?: boolean;
    name: string;
    ownerOnly?: boolean;
    options?: APIApplicationCommandOption[];
    userPermissions?:
        | PermissionResolvable
        | PermissionResolvable[]
        | MissingPermissionSupplier;
}
