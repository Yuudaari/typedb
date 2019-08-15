import Table from "./Table";

export default abstract class Database<TABLES extends { [key: string]: any }> {
	public constructor () { }

	public abstract getTable<N extends Extract<keyof TABLES, string>> (name: N): Table<TABLES[N]>;
}
