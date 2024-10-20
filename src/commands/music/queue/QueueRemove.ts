import Command from '../../../structure/commands/Command.js';
import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    AutocompleteInteraction,
} from 'discord.js';
import Utilities from '../../../modules/tool/Utilities.js';
import Permission from '../../../modules/tool/Permission.js';
import EmbedFormatter from '../../../modules/tool/EmbedFormatter.js';
import QueueAutocomplete from '../../../modules/music/QueueAutocomplete.js';

export default class QueueRemove extends Command {
    constructor() {
        super('queueRemove', {
            name: 'queue remove',
            description: 'Remove a song from the queue',
            category: 'music',
            options: [
                {
                    name: 'song-name',
                    description:
                        'The name of the song to remove from the queue',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
            userPermissions: async (
                interaction: ChatInputCommandInteraction,
            ) => {
                return await Permission.musicTrustedPermissionsCheck(
                    this.client,
                    interaction,
                );
            },
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

        const songName = interaction.options.getString('song-name', true);
        const song = await this.client.database.song.getSong(songName);

        if (!song) {
            return await interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        'This song could not be found.',
                    ),
                ],
            });
        }

        const isQueued = await server.isSongQueued(song.Id);

        if (!isQueued) {
            return interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        'This song is not in the queue at the moment.',
                    ),
                ],
            });
        }

        await server.dequeue(song.Id);

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed().setDescription(
                    `${song.OfficialName} has been removed from the queue.`,
                ),
            ],
        });
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        await QueueAutocomplete.SongAutocomplete(interaction, this.client);
    }
}
