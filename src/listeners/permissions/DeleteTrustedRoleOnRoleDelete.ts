import Listener from '../../structure/listeners/Listener.js';
import { Events, Role } from 'discord.js';

export default class DeleteTrustedRoleOnRoleDelete extends Listener {
    constructor() {
        super('deleteTrustedRoleOnRoleDelete', {
            event: Events.GuildRoleDelete,
            emitter: 'client',
            category: 'permissions',
        });
    }

    async exec(role: Role) {
        await this.client.database.guild.clearGuildTrustedRoleByRoleId(role.id);
    }
}
