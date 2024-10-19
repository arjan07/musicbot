import Listener from '../../structure/listeners/Listener.js';
import { EmbedBuilder, Colors, ChatInputCommandInteraction } from 'discord.js';
import Utilities from '../../modules/tool/Utilities.js';
import Command from '../../structure/commands/Command.js';

export default class MissingPermission extends Listener {
    constructor() {
        super('missingPermission', {
            event: 'missingPermissions',
            category: 'commandHandler',
            emitter: 'commandHandler',
        });
    }

    exec(
        interaction: ChatInputCommandInteraction,
        command: Command,
        type: string,
        missing: any,
    ) {
        const embed = new EmbedBuilder().setColor(Colors.Red);

        const getChannel = () => {
            if (!interaction.inGuild()) return;
            const server = Utilities.getMusicServer(
                this.client,
                interaction.guildId,
            );
            if (!server) return;
            const channel = server.isInStageChannel()
                ? server.getStageChannel()
                : server.getVoiceChannel();
            return channel!.name;
        };

        if (type === 'client') {
            embed.setDescription(
                `I cannot use the **${command.name}** command in this channel as I am missing the \`${missing.join(', ')}\` permission.`,
            );
        } else {
            switch (missing) {
                case 'VoiceChannel':
                    embed.setDescription(
                        `You must be in the **${getChannel()}** voice channel in order to use the **${command.name}** command.`,
                    );
                    break;
                default:
                    embed.setDescription(
                        `You do not have the correct permissions to use the **${command.name}** command.`,
                    );
                    break;
            }
        }

        return interaction.editReply({ embeds: [embed] });
    }
}
