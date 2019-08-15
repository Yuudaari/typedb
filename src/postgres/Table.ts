import { Client, FieldDef, Pool, PoolClient } from "pg";
import Table from "../base/Table";
import Override from "../decorator/Override";
import PostgresInsert from "./query/Insert";
import PostgresSelect from "./query/Select";

export default class PostgresTable<SCHEMA extends { [key: string]: any; }> extends Table<SCHEMA> {
	public constructor (public readonly name: string, private readonly pool: Client | Pool | PoolClient) {
		super(name);
	}

	@Override public insert<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS) {
		return new PostgresInsert<SCHEMA, COLUMNS>(this, columns);
	}

	public select (all: "*"): PostgresSelect<SCHEMA>;
	public select<COLUMNS extends (keyof SCHEMA)[]> (...columns: COLUMNS): PostgresSelect<SCHEMA, COLUMNS>;
	@Override public select (...columns: string[]) {
		return new PostgresSelect(this, columns as (keyof SCHEMA)[]);
	}

	public async query (query: string | { query: string; values: any[] }): Promise<any[]>;
	public async query (query: string | { query: string; values: any[] }, fields: true): Promise<{ results: any[], fields: FieldDef[] }>;
	@Override public async query (query: string | { query: string; values: any[] }, includeFields = false) {
		let values: any[] = [];
		if (typeof query === "object") {
			values = query.values;
			query = query.query;
		}

		console.log(query, values);

		return new Promise((resolve, reject) => this.pool.query(query as string, values, (err, result) => {
			if (err) return reject(err);

			const { rows, fields } = result;

			if (includeFields) resolve({ results: rows, fields });
			else resolve(rows);
		}));
	}
}
