// tslint:disable no-string-literal

import { Client, FieldDef, Pool, PoolClient } from "pg";
import { DataTypeValue } from "../../base/DataType";
import Select, { createExpressionBuilder, Expression, ExpressionAndOr, ExpressionBuilder, ExpressionBuilderFunction, Operations, Result } from "../../base/query/Select";
import Override from "../../decorator/Override";
import PostgresTable from "../Table";

export default class PostgresSelect<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Select<SCHEMA, COLUMNS> {

	private readonly expression = new PostgresExpression<SCHEMA, COLUMNS>();

	public constructor (private readonly table: PostgresTable<SCHEMA>, private readonly columns: "*" | COLUMNS) {
		super();
	}

	public where (initializer: (expr: PostgresExpression<SCHEMA, COLUMNS>["is"]) => any): this;
	public where<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): this;
	public where<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): this;
	public where<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): this;
	@Override public where (column: string | ((expr: PostgresExpression<SCHEMA, COLUMNS>["is"]) => any), operation?: string, value?: string | number | null, value2?: string | number) {
		this.expression.is(column as COLUMNS[number], operation as never, value as never);
		return this;
	}

	public async query (pool?: Client | Pool | PoolClient): Promise<Result<SCHEMA, COLUMNS[number]>[]>;
	public async query (pool: Client | Pool | PoolClient | undefined, includeFields: true): Promise<{ results: Result<SCHEMA, COLUMNS[number]>[], fields: FieldDef[] }>;
	@Override public async query (pool?: Client | Pool | PoolClient, includeFields?: boolean) {
		return this.getTable().query(pool!, this.compile(), includeFields as true) as any;
	}

	@Override protected compile () {
		let query = `SELECT ${this.columns === "*" ? "*" : this.columns.join(",")} FROM ${this.table.name}`;
		const where = this.expression["filters"].join("");
		if (where) query += ` WHERE ${where}`;
		return {
			query,
			values: this.expression["values"],
		};
	}

	@Override protected getTable () {
		return this.table;
	}
}

const operations: { [key: string]: string } = {
	"==": "=",
};

class PostgresExpression<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> extends Expression<SCHEMA, COLUMNS> {

	private filters: string[] = [];
	private values: any[] = [];

	@Override public get is (): ExpressionBuilder<SCHEMA, COLUMNS, ExpressionAndOr<SCHEMA, COLUMNS>> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			const notString = not ? "NOT " : "";

			if (typeof column === "function") {
				const expr = new PostgresExpression<SCHEMA, COLUMNS>();
				column(expr.is);
				this.filters.push(`(${notString}(${expr.filters.join("")}))`);
				this.values.push(...expr.values);

			} else if (value === null) this.filters.push(`(${notString}${column} IS NULL)`);

			else if (operation === "BETWEEN") this.filters.push(`(${notString}${column} BETWEEN ${this.value(value)} AND ${this.value(value2)})`);

			else this.filters.push(`(${notString}${column} ${operations[`${operation}`] || operation} ${this.value(value)})`);

			return new PostgresExpressionAndOr(this);
		});
	}

	private value (value?: string | number | null): "?" {
		this.values.push(value);
		return "?";
	}
}

class PostgresExpressionAndOr<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> extends ExpressionAndOr<SCHEMA, COLUMNS> {

	private get filters () {
		return this.expression["filters"];
	}
	public constructor (private readonly expression: PostgresExpression<SCHEMA, COLUMNS>) {
		super();
	}

	@Override public get and (): ExpressionBuilder<SCHEMA, COLUMNS, this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA, COLUMNS>)(column, operation, value, value2, not);
			this.filters[this.filters.length - 1] = " AND " + this.filters[this.filters.length - 1];
			return this;
		});
	}

	@Override public get or (): ExpressionBuilder<SCHEMA, COLUMNS, this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA, COLUMNS>)(column, operation, value, value2, not);
			this.filters[this.filters.length - 1] = " OR " + this.filters[this.filters.length - 1];
			return this;
		});
	}
}
