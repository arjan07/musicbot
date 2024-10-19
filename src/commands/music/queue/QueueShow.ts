import Command from '../../../structure/commands/Command.js';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import Utilities from '../../../modules/tool/Utilities.js';
import EmbedFormatter from '../../../modules/tool/EmbedFormatter.js';
import Paginator from '../../../modules/tool/Paginator.js';

export default class QueueShow extends Command {
    constructor() {
        super('queueShow', {
            name: 'queue show',
            description: 'View which songs are currently in the queue',
            category: 'music',
            clientPermissions: [PermissionsBitField.Flags.ViewChannel],
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
        const queue = await server.getQueue();

        const alreadyQueued =
            queue.length > 0 &&
            recent['QueuedBy'] !== null &&
            recent['OfficialName'] === queue[0]['OfficialName'];

        if (alreadyQueued) queue.shift();

        const queuedSongs = queue.map(
            (song) => `1\\. ${song.OfficialName} - ${song.ArtistName}`,
        );

        const description =
            queuedSongs.length === 0
                ? 'There is nothing else queued at the moment.'
                : 'Queued for play:\n';

        const embedArray = Paginator.createEmbeds(
            queue.length === 0 ? [] : [description, ...queuedSongs],
            alreadyQueued
                ? `Currently Playing: ${recent['OfficialName']} (Queued)`
                : `Currently Playing: ${recent['OfficialName']}`,
            '#FF69B4',
            null,
            null,
            null,
            null,
            10,
        );

        const paginator = new Paginator(
            interaction,
            embedArray,
            false,
            "There's nothing queued at the moment.",
        );

        return await paginator.send();
    }
}
