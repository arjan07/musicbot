import { Collection } from 'discord.js';
import Module from './Module.js';

export default class Category<
    K extends string,
    V extends Module,
> extends Collection<K, V> {
    public declare id: string;
    public constructor(id: string, iterable?: Iterable<readonly [K, V]>) {
        super(iterable!);
        this.id = id;
    }

    public override toString(): string {
        return this.id;
    }
}
