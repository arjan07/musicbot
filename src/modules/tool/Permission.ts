import {
    ChatInputCommandInteraction,
    GuildMember,
    PermissionsBitField,
} from 'discord.js';
import Utilities from './Utilities.js';
import Client from '../../structure/Client.js';

const modRole = PermissionsBitField.Flags.ModerateMembers;

export default class Permission {
    static async musicPermissionsCheck(
        client: Client,
        interaction: ChatInputCommandInteraction,
    ) {
        const member = interaction.member as GuildMember;

        if (this.isMod(member)) return null;
        if (!this.memberIsInVoiceChannel(client, interaction))
            return 'VoiceChannel';
        return null;
    }

    static async musicTrustedPermissionsCheck(
        client: Client,
        interaction: ChatInputCommandInteraction,
    ) {
        const member = interaction.member as GuildMember;

        if (this.isMod(member)) return null;
        if (!(await this.isTrustedMember(client, member))) return 'TrustedRole';
        if (!this.memberIsInVoiceChannel(client, interaction))
            return 'VoiceChannel';
        return null;
    }

    static isMod(member: GuildMember) {
        return member.permissions.has(modRole);
    }

    static memberIsInVoiceChannel(
        client: Client,
        interaction: ChatInputCommandInteraction,
    ) {
        const server = Utilities.getMusicServer(client, interaction.guildId!)!;
        const channel = (
            server.isInStageChannel()
                ? server.getStageChannel()
                : server.getVoiceChannel()
        )!;
        const memberChannel = (interaction.member as GuildMember).voice.channel;
        if (!memberChannel) return false;
        return memberChannel.id === channel.id;
    }

    static async isTrustedMember(
        client: Client,
        member: GuildMember,
    ): Promise<boolean> {
        const role = await client.database.guild.getGuildTrustedRole(
            member.guild.id,
        );
        if (!role) return false;
        return member.roles.cache.has(role);
    }
}
