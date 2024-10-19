import Command from '../../../structure/commands/Command.js';
import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    AutocompleteInteraction,
} from 'discord.js';
import Utilities from '../../../modules/tool/Utilities.js';
import EmbedFormatter from '../../../modules/tool/EmbedFormatter.js';
import DataFormatter from '../../../modules/tool/DataFormatter.js';
import QueueAutocomplete from '../../../modules/music/QueueAutocomplete.js';

export default class SongInformation extends Command {
    constructor() {
        super('songInformation', {
            name: 'song information',
            description: 'View information about a song',
            category: 'music',
            options: [
                {
                    name: 'song-name',
                    type: ApplicationCommandOptionType.String,
                    description:
                        'The name of the song to view information for (defaults to the current song)',
                    required: false,
                    autocomplete: true,
                },
            ],
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

        const songName = interaction.options.getString('song-name', false);
        const song = songName
            ? await this.client.database.song.getSong(songName)
            : (await server.getRecent(1))[0];

        if (!song) {
            return await interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        `This song could not be found.`,
                    ),
                ],
            });
        }

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed()
                    .setTitle(`${song.OfficialName} - ${song.ArtistName}`)
                    .setThumbnail(song.AlbumArtworkUrl)
                    .addFields([
                        {
                            name: 'Album',
                            value: song.AlbumName.toString(),
                            inline: true,
                        },
                        {
                            name: 'Track Number',
                            value: song.TrackNumber.toString(),
                            inline: true,
                        },
                        {
                            name: 'Play Count',
                            value: DataFormatter.formatNumber(song.PlayCount),
                            inline: true,
                        },
                    ]),
            ],
        });
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        await QueueAutocomplete.SongAutocomplete(interaction, this.client);
    }
}
