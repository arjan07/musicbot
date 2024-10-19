import { AutocompleteInteraction } from 'discord.js';
import Client from '../../structure/Client.js';

export default class QueueAutocomplete {
    static async SongAutocomplete(
        interaction: AutocompleteInteraction,
        client: Client,
    ) {
        const input = interaction.options
            .getString('song-name', true)
            .toLowerCase();
        if (!input) return interaction.respond([]);

        const songs = await client.database.song.songAutoComplete(`${input}%`);

        const response = songs
            .filter(
                (value, index, self) =>
                    index ===
                    self.findIndex(
                        (t) => t['OfficialName'] === value['OfficialName'],
                    ),
            )
            .map((song) => ({
                name: `${song['OfficialName']} - ${song['ArtistName']}`,
                value: song['OfficialName'],
            }));

        await interaction.respond(response);
    }

    static async AlbumAutocomplete(
        interaction: AutocompleteInteraction,
        client: Client,
    ) {
        const input = interaction.options
            .getString('album-name', true)
            .toLowerCase();
        if (!input) return interaction.respond([]);

        const albums = await client.database.song.albumAutoComplete(
            `${input}%`,
        );

        const response = albums.map((album) => ({
            name: `${album['AlbumName']} - ${album['ArtistName']}`,
            value: album['AlbumName'],
        }));

        await interaction.respond(response);
    }
}
