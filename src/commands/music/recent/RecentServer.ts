import Command from '../../../structure/commands/Command.js';
import { ChatInputCommandInteraction, orderedList } from 'discord.js';
import Utilities from '../../../modules/tool/Utilities.js';
import EmbedFormatter from '../../../modules/tool/EmbedFormatter.js';

export default class Recent extends Command {
    constructor() {
        super('recentServer', {
            name: 'recent server',
            description:
                'Shows the 10 most recently played songs on the server',
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

        const recent = await server.getRecent(11);
        const current = recent[0].OfficialName;
        recent.shift();

        const recentSongs = orderedList(
            recent.map(
                (recent) => `${recent.OfficialName} - ${recent.ArtistName}`,
            ),
        );

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed()
                    .setTitle(`Currently playing: ${current}`)
                    .setDescription(`Recently Played:\n${recentSongs}`),
            ],
        });
    }
}
