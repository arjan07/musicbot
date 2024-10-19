import Command from '../../structure/commands/Command.js';
import { ChatInputCommandInteraction } from 'discord.js';
import Utilities from '../../modules/tool/Utilities.js';
import EmbedFormatter from '../../modules/tool/EmbedFormatter.js';

export default class Current extends Command {
    constructor() {
        super('current', {
            name: 'current',
            description: 'Shows what song is currently playing',
            guildOnly: true,
            category: 'music',
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

        const recent = (await server.getRecent(1))[0];
        const queuedBy = recent.QueuedBy;

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed()
                    .setTitle(recent.OfficialName)
                    .setDescription(
                        `${recent.AlbumName} - ${recent.ArtistName}`,
                    )
                    .setThumbnail(recent.AlbumArtworkUrl)
                    .setFooter(
                        queuedBy ? { text: `Queued by: ${queuedBy}` } : null,
                    ),
            ],
        });
    }
}
