export interface TypeDBConfig {
    paths: {
        root: string;
        tables: string;
        migrations: string;
    };
}
export declare const defaultConfig: TypeDBConfig;
declare const _default: {
    cwd: string | undefined;
    config: TypeDBConfig;
    getPath(pathName: "tables" | "root" | "migrations", cwd?: string): string;
    get(cwd?: string | undefined): TypeDBConfig;
};
export default _default;
