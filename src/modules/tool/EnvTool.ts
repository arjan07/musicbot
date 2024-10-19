export default class EnvTool {
    /**
     * Get a specific variable from the runtime environment
     * @param name
     */
    static getEnvVariable(name: string) {
        const value = process.env[name];
        if (value === undefined)
            throw new Error(`Environment variable ${name} is undefined.`);
        return value;
    }
}
