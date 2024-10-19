import Command from '../../structure/commands/Command.js';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import Paginator from '../../modules/tool/Paginator.js';

export default class Albums extends Command {
    constructor() {
        super('albums', {
            name: 'albums',
            description: 'View which albums are queueable',
            category: 'music',
            clientPermissions: [PermissionsBitField.Flags.ViewChannel],
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const albums = await this.client.database.song.getAvailableAlbums();
        const albumList = albums.map(
            (album, i) => `${i + 1}. ${album.AlbumName} - ${album.ArtistName}`,
        );

        const embedArray = Paginator.createEmbeds(
            albumList,
            'Queueable Albums:',
            '#FF69B4',
            null,
            null,
            null,
            null,
            10,
        );
        const paginator = new Paginator(interaction, embedArray, false);
        return await paginator.send();
    }
}
