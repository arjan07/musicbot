import Command from '../../../structure/commands/Command.js';
import {
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
} from 'discord.js';
import Utilities from '../../../modules/tool/Utilities.js';
import Permission from '../../../modules/tool/Permission.js';
import EmbedFormatter, {
    StandardColours,
} from '../../../modules/tool/EmbedFormatter.js';
import QueueAutocomplete from '../../../modules/music/QueueAutocomplete.js';

export default class QueueAdd extends Command {
    constructor() {
        super('queueAdd', {
            name: 'queue add',
            description: 'Add a song to the queue',
            category: 'music',
            userPermissions: async (
                interaction: ChatInputCommandInteraction,
            ) => {
                return await Permission.musicPermissionsCheck(
                    this.client,
                    interaction,
                );
            },
            options: [
                {
                    name: 'song-name',
                    description: 'The name of the song to queue',
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

        const result = await server.addToQueue(
            song.Path,
            song.OfficialName,
            song.ArtistName,
            song.Id,
            interaction.user.username,
        );

        return interaction.editReply({
            embeds: [
                EmbedFormatter.plainEmbed(
                    result.success
                        ? StandardColours.Success
                        : StandardColours.Failure,
                ).setDescription(result.reason),
            ],
        });
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        await QueueAutocomplete.SongAutocomplete(interaction, this.client);
    }
}
