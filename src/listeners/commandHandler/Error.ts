import Listener from '../../structure/listeners/Listener.js';
import { ChatInputCommandInteraction } from 'discord.js';
import Command from '../../structure/commands/Command.js';
import LoggerTool from '../../modules/tool/LoggerTool.js';
import EmbedFormatter from '../../modules/tool/EmbedFormatter.js';

export default class Error extends Listener {
    constructor() {
        super('commandError', {
            event: 'error',
            category: 'commandHandler',
            emitter: 'commandHandler',
        });
    }

    async exec(
        err: any,
        interaction: ChatInputCommandInteraction,
        command: Command,
    ) {
        LoggerTool.error(
            `CommandHandler Error: ${err} With Command: ${command.id}`,
        );

        const embed = EmbedFormatter.standardErrorEmbed().setDescription(
            "Sorry, an unknown error occurred! I'll try to get this fixed as soon as possible :pleading:",
        );

        const repliedOrDeferred = interaction.deferred ?? interaction.replied;

        return repliedOrDeferred
            ? interaction.editReply({ embeds: [embed] })
            : interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
