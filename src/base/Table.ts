import Insert from "./query/Insert";
import Select from "./query/Select";
import Update from "./query/Update";

export default abstract class Table<SCHEMA extends { [key: string]: any; }> {
	public constructor (public readonly name: string) { }

	public abstract select (all: "*"): Select<SCHEMA>;
	public abstract select<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): Select<SCHEMA, COLUMNS>;

	public abstract insert<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): Insert<SCHEMA, COLUMNS, any>;

	public abstract update<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): Update<SCHEMA, any>;

	public abstract async query (query: string | { query: string; values: any[] }): Promise<any>;
}
