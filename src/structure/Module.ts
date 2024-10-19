import type Client from './Client.js';
import Category from './Category.js';
import Handler from './Handler.js';

export default abstract class Module {
    public declare category: Category<string, Module>;
    public declare categoryID: string;
    public declare client: Client;
    public declare filepath: string;
    public declare handler: Handler;
    public declare id: string;

    protected constructor(id: string, options?: ModuleOptions) {
        const { category = 'default' } = options ?? {};

        this.id = id;
        this.categoryID = category;
        this.category = null!;
        this.filepath = null!;
        this.client = null!;
        this.handler = null!;
    }

    public toString(): string {
        return this.id;
    }
}

export interface ModuleOptions {
    category?: string;
}
