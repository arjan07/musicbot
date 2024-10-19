import Command from '../../../structure/commands/Command.js';
import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    PermissionsBitField,
    AutocompleteInteraction,
} from 'discord.js';
import fs from 'fs';
import Utilities from '../../../modules/tool/Utilities.js';
import EmbedFormatter from '../../../modules/tool/EmbedFormatter.js';
import QueueAutocomplete from '../../../modules/music/QueueAutocomplete.js';

export default class Albums extends Command {
    constructor() {
        super('queueAlbum', {
            name: 'queue album',
            description: 'Add an album to the queue',
            category: 'music',
            userPermissions: [PermissionsBitField.Flags.ModerateMembers],
            options: [
                {
                    name: 'album-name',
                    description: 'The name of the album to add to the queue',
                    type: ApplicationCommandOptionType.String,
                    required: true,
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

        const albumName = interaction.options.getString('album-name', true);
        const album = await this.client.database.song.getAlbum(albumName);

        if (album.length === 0) {
            return interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        'Sorry, I could not find this album. Please try again with a different album.',
                    ),
                ],
            });
        }

        const queue = await server.getQueue();
        const filepath = server.getFilePath();

        queue.forEach((song) => {
            if (song.AlbumName === albumName) {
                server.dequeue(song.SongId);
            }
        });

        const songs = album
            .filter((song) => fs.existsSync(`${filepath}${song.Path}`))
            .map((song) => [
                song.Id,
                interaction.guildId,
                interaction.user.username,
            ]);

        if (songs.length === 0) {
            return interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        `Unable to queue ${album[0].AlbumName}.`,
                    ),
                ],
            });
        }

        await this.client.database.queue.addAlbumToGuildQueue(songs);

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed().setDescription(
                    `${album[0].AlbumName} by ${album[0].ArtistName} has been queued.`,
                ),
            ],
        });
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        await QueueAutocomplete.AlbumAutocomplete(interaction, this.client);
    }
}
