import Command from '../../structure/commands/Command.js';
import { ChatInputCommandInteraction, PermissionsBitField } from 'discord.js';
import EmbedFormatter from '../../modules/tool/EmbedFormatter.js';

export default class TrustedRoleView extends Command {
    constructor() {
        super('trustedRoleView', {
            name: 'trusted-role view',
            description: 'View the trusted role in the server',
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

        const trustedRole = interaction.guild?.roles.cache.get(trustedRoleId);

        return interaction.editReply({
            embeds: [
                EmbedFormatter.standardSuccessEmbed()
                    .setTitle('Trusted Role')
                    .setDescription(
                        `The trusted role in this server is currently set to ${trustedRole?.name} (${trustedRole}).`,
                    ),
            ],
        });
    }
}
