import Command from '../../structure/commands/Command.js';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import EmbedFormatter from '../../modules/tool/EmbedFormatter.js';

export default class TrustedRoleClear extends Command {
    constructor() {
        super('trustedRoleClear', {
            name: 'trusted-role clear',
            description: 'Clear the trusted role in the server',
            guildOnly: true,
            category: 'trusted',
            userPermissions: [PermissionsBitField.Flags.ModerateMembers],
        });
    }

    async exec(interaction: ChatInputCommandInteraction) {
        const trustedRoleId =
            await this.client.database.guild.getGuildTrustedRole(
                interaction.guildId!,
            );

        if (!trustedRoleId) {
            return interaction.editReply({
                embeds: [
                    EmbedFormatter.standardErrorEmbed().setDescription(
                        'The trusted role has not been set in this server.',
                    ),
                ],
            });
        }

        await this.client.database.guild.clearGuildTrustedRole(
            interaction.guildId!,
        );

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed().setDescription(
                    'Successfully cleared the trusted role.',
                ),
            ],
        });
    }
}
