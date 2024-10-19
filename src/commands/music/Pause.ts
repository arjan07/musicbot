import Command from '../../structure/commands/Command.js';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import Utilities from '../../modules/tool/Utilities.js';
import EmbedFormatter from '../../modules/tool/EmbedFormatter.js';

export default class Pause extends Command {
    constructor() {
        super('pause', {
            name: 'pause',
            description: 'Pauses music on the bot',
            guildOnly: true,
            category: 'music',
            userPermissions: [PermissionsBitField.Flags.ModerateMembers],
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const server = Utilities.getMusicServer(
            this.client,
            interaction.guildId!,
        );

        if (!server) {
            return interaction.editReply({
                embeds: [EmbedFormatter.notMusicServer()],
            });
        }

        if (server.isPaused()) {
            return interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        'Music is already paused.',
                    ),
                ],
            });
        } else {
            server.pause();
            return interaction.editReply({
                embeds: [
                    EmbedFormatter.standardSuccessEmbed().setDescription(
                        'Music has been paused.',
                    ),
                ],
            });
        }
    }
}
