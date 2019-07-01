import { Connection } from "mysql";
import Column from "./Column";
import Query from "./Query";
import Row from "./Row";

export default class Table<SCHEMA extends { [key: string]: any; }> {
	public constructor (public readonly name: string, private readonly connection: Connection) { }

	public addColumn<KEY extends Extract<keyof SCHEMA, string>> (key: KEY, type: SCHEMA[KEY], initializer: (column: Column<SCHEMA[KEY]>) => any) {
		const column = new Column(key, type);
		initializer(column);
		return column;
	}

	public deleteColumn<KEY extends Extract<keyof SCHEMA, string>> (key: KEY) {

	}

	public addRow (initializer: (row: Row<SCHEMA>) => any) {

	}

	public select (all: "*"): Query<SCHEMA>;
	public select<COLUMNS extends Extract<keyof SCHEMA, string>[]> (...columns: COLUMNS): Query<SCHEMA, COLUMNS>;
	public select (...columns: string[]) {
		return new Query<SCHEMA>(this, columns as Extract<keyof SCHEMA, string>[]);
	}

	public async query (query: string) {
		console.log(query);
		// return new Promise((resolve, reject) => this.connection.query(query, (err, results, fields) => {
		// 	console.log({ err, results, fields });
		// }));
	}
}
