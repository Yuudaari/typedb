import Table from "./Table";
export default abstract class Database<TABLES extends {
    [key: string]: any;
}> {
    constructor();
    abstract getTable<N extends Extract<keyof TABLES, string>>(name: N): Table<TABLES[N]>;
}
