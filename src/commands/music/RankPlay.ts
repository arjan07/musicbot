import Command from '../../structure/commands/Command.js';
import {
    ChatInputCommandInteraction,
    ApplicationCommandOptionType,
    orderedList,
} from 'discord.js';
import EmbedFormatter from '../../modules/tool/EmbedFormatter.js';

export default class RankPlay extends Command {
    constructor() {
        super('rankPlay', {
            name: 'rank-play',
            description: 'Shows a ranking of the most played songs',
            guildOnly: true,
            category: 'music',
            options: [
                {
                    name: 'limit',
                    description: 'The number to limit the rank at',
                    type: ApplicationCommandOptionType.Integer,
                    min_value: 5,
                    max_value: 25,
                },
            ],
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const limit = interaction.options.getInteger('limit', false);

        const ranking = await this.client.database.song.rankSongPlays(limit);
        const rankedPlays = orderedList(
            ranking.map((rank) => `${rank.OfficialName} - ${rank.PlayCount}`),
        );

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed()
                    .setTitle('Ranked Plays')
                    .setDescription(rankedPlays),
            ],
        });
    }
}
