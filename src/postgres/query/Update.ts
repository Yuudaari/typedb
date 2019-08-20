import { Client, Pool, PoolClient, QueryResult } from "pg";
import { Row } from "../../base/DataType";
import { createExpressionBuilder, ExpressionBuilder, ExpressionBuilderFunction } from "../../base/query/Expression";
import Update from "../../base/query/Update";
import Bound from "../../decorator/Bound";
import Override from "../../decorator/Override";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";
import { PostgresExpression } from "./Expression";

export default class PostgresUpdate<SCHEMA extends { [key: string]: any }, RETURN_COLUMNS extends (keyof SCHEMA)[] = []>
	extends Update<SCHEMA, number | Row<SCHEMA, RETURN_COLUMNS[number]>[] | Overwrite<QueryResult, { rows: Row<SCHEMA, RETURN_COLUMNS[number]>[] }>> {

	private readonly expression = new PostgresExpression<SCHEMA, (keyof SCHEMA)[]>(this.value);
	private readonly values: any[] = [];
	private returnColumns: RETURN_COLUMNS = [] as any;

	public constructor (private readonly table: PostgresTable<SCHEMA>) {
		super();
	}

	@Override public get where (): ExpressionBuilder<SCHEMA, (keyof SCHEMA)[], this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA, (keyof SCHEMA)[]>)(column, operation, value, value2, not);
			return this;
		});
	}

	public returning<COLUMNS_NEW extends (keyof SCHEMA)[] | ["*"]> (...columns: COLUMNS_NEW): PostgresUpdate<SCHEMA, COLUMNS_NEW extends ["*"] ? (keyof SCHEMA)[] : COLUMNS_NEW> {
		this.returnColumns = columns as any;
		return this as any;
	}

	public async query (pool?: Client | Pool | PoolClient): Promise<RETURN_COLUMNS["length"] extends 0 ? number : Row<SCHEMA, RETURN_COLUMNS[number]>[]>;
	public async query (pool: Client | Pool | PoolClient | undefined, resultObject: true): Promise<Overwrite<QueryResult, { rows: Row<SCHEMA, RETURN_COLUMNS[number]>[] }>>;
	@Override public async query (pool?: Client | Pool | PoolClient, resultObject?: boolean) {
		const results = await this.table.query(pool!, this.compile());

		if (resultObject) return results;
		return this.returnColumns.length ? results.rows : results.rowCount;
	}

	private compile () {
		let query = `UPDATE ${this.table.name}`;

		if (!this.columnUpdates.length) throw new Error("No columns to update");
		query += ` SET ${this.columnUpdates.map(([column, value]) => `${column} = ${this.value(value)}`).join(", ")}`;

		const where = this.expression.compile();
		if (where) query += ` WHERE ${where}`;

		if (this.returnColumns.length) query += ` RETURNING ${this.returnColumns.join(",")}`;

		return { query, values: this.values };
	}

	@Bound private value (value?: string | number | null) {
		this.values.push(value);
		return `$${this.values.length}`;
	}
}
