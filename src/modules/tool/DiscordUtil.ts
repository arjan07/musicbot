import {
    Guild,
    GuildBasedChannel,
    GuildMember,
    ImageSize,
    Snowflake,
    User,
} from 'discord.js';
import Client from '../../structure/Client.js';

export default class DiscordUtil {
    static getUserAvatar(
        user: User | GuildMember,
        iconsSize: ImageSize = 128,
        getGuildAvatar = true,
    ) {
        return (
            user instanceof GuildMember && !getGuildAvatar ? user.user : user
        ).displayAvatarURL({
            size: iconsSize,
            extension: 'png',
            forceStatic: false,
        });
    }

    static getRoleFromSnowflake(guild: Guild, roleId: Snowflake) {
        const role = guild.roles.cache.get(roleId);
        return role ? `${role.name} (${role})` : 'Unknown Role';
    }

    static formatAsUserAndId(user: User) {
        return `${user.username} (${user.id})`;
    }

    static formatAsUserAndMention(user: User) {
        return `${user.username} (${user})`;
    }

    static formatAsChannelAndMention(channel: GuildBasedChannel) {
        return `${channel.name} (${channel})`;
    }

    static formatCommandAsMention(commandName: string, client: Client) {
        const command = client.apiCommands?.find(
            (command) => command.name === commandName.split(' ')[0].trim(),
        );
        return !command ? undefined : `</${commandName}:${command.id}>`;
    }
}
