import { Connection } from "mysql";
import Table from "./Table";

export default class Database<TABLES extends { [key: string]: any }> {
	public constructor (private readonly connection: Connection) {
	}

	public getTable<N extends Extract<keyof TABLES, string>> (name: N) {
		return new Table<TABLES[N]>(name, this.connection);
	}
}
