// tslint:disable no-string-literal

import { DataType, DataTypeValue } from "./DataType";
import Table from "./Table";

enum Operation {
	"==",
	"!=",
	"<",
	">",
	"<=",
	">=",
	"BETWEEN",
}

type NumericOperation = keyof typeof Operation;

type StringOperation = "==" | "!=";

type Operations<DATATYPE extends DataType> =
	DATATYPE extends string ? StringOperation :
	DATATYPE extends string[] ? StringOperation : {
		// numeric
		[DataType.INTEGER]: NumericOperation;
		[DataType.INT]: NumericOperation;
		[DataType.SMALLINT]: NumericOperation;
		[DataType.TINYINT]: NumericOperation;
		[DataType.MEDIUMINT]: NumericOperation;
		[DataType.BIGINT]: NumericOperation;
		[DataType.DECIMAL]: NumericOperation;
		[DataType.NUMERIC]: NumericOperation;
		[DataType.FLOAT]: NumericOperation;
		[DataType.DOUBLE]: NumericOperation;
		[DataType.BIT]: NumericOperation;

		// datetime
		[DataType.DATE]: NumericOperation;
		[DataType.DATETIME]: NumericOperation;
		[DataType.TIMESTAMP]: NumericOperation;
		[DataType.TIME]: NumericOperation;
		[DataType.YEAR]: NumericOperation;

		// string
		[DataType.CHAR]: StringOperation;
		[DataType.VARCHAR]: StringOperation;
		[DataType.BINARY]: StringOperation;
		[DataType.VARBINARY]: StringOperation;
		[DataType.BLOB]: StringOperation;
		[DataType.TEXT]: StringOperation;
	}[DATATYPE];

const operations: { [key: string]: string } = {
	"==": "=",
};

type Result<SCHEMA, COLUMNS extends keyof SCHEMA> = {
	[COLUMN in COLUMNS]: SCHEMA[COLUMN] extends DataType ? DataTypeValue<SCHEMA[COLUMN]> : SCHEMA[COLUMN];
};

export default class Query<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	private readonly expression = new Expression<SCHEMA, COLUMNS>();

	public constructor (private readonly table: Table<SCHEMA>, private readonly columns: "*" | COLUMNS) { }

	public where (initializer: (expr: Expression<SCHEMA, COLUMNS>["is"]) => any): this;
	public where<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): this;
	public where<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): this;
	public where<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): this;
	public where (column: string | ((expr: Expression<SCHEMA, COLUMNS>["is"]) => any), operation?: string, value?: string | number | null, value2?: string | number) {
		this.expression.is(column as COLUMNS[number], operation as never, value as never);
		return this;
	}

	public query (): Result<SCHEMA, COLUMNS[number]>[] {
		return this.table.query(this.compile()) as any;
	}

	private compile () {
		let query = `SELECT ${this.columns === "*" ? "*" : this.columns.join(",")} FROM ${this.table.name}`;
		const where = this.expression["filters"].join("");
		if (where) query += ` WHERE ${where}`;
		return {
			query,
			values: this.expression["values"],
		};
	}
}

class Expression<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> {

	private filters: string[] = [];
	private values: any[] = [];

	public is (initializer: (expr: Expression<SCHEMA, COLUMNS>["is"]) => any): ExpressionAndOr<SCHEMA, COLUMNS>;
	public is<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): ExpressionAndOr<SCHEMA, COLUMNS>;
	public is<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): ExpressionAndOr<SCHEMA, COLUMNS>;
	public is<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): ExpressionAndOr<SCHEMA, COLUMNS>;
	public is (column: string | ((expr: Expression<SCHEMA, COLUMNS>["is"]) => any), operation?: string, value?: string | number | null, value2?: string | number) {
		if (typeof column === "function") {
			const expr = new Expression<SCHEMA, COLUMNS>();
			column(expr.is.bind(expr));
			this.filters.push(`(${expr.filters.join("")})`);
			this.values.push(...expr.values);

		} else if (value === null) this.filters.push(`(${column} IS NULL)`);

		else if (operation === "BETWEEN") this.filters.push(`(${column} BETWEEN ${this.value(value)} AND ${this.value(value2)})`);

		else this.filters.push(`(${column} ${operations[`${operation}`] || operation} ${this.value(value)})`);

		return new ExpressionAndOr(this);
	}

	private value (value?: string | number | null): "?" {
		this.values.push(value);
		return "?";
	}
}

class ExpressionAndOr<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> {

	private get filters () {
		return this.expression["filters"];
	}
	public constructor (private readonly expression: Expression<SCHEMA, COLUMNS>) { }

	public or (initializer: (expr: Expression<SCHEMA, COLUMNS>["is"]) => any): this;
	public or<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): this;
	public or<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): this;
	public or<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): this;
	public or (column: string | ((expr: Expression<SCHEMA, COLUMNS>["is"]) => any), operation?: string, value?: string | number | null) {
		this.expression.is(column as COLUMNS[number], operation as never, value as never);
		this.filters[this.filters.length - 1] = " OR " + this.filters[this.filters.length - 1];
		return this;
	}

	public and (initializer: (expr: Expression<SCHEMA, COLUMNS>["is"]) => any): this;
	public and<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): this;
	public and<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): this;
	public and<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): this;
	public and (column: string | ((expr: Expression<SCHEMA, COLUMNS>["is"]) => any), operation?: string, value?: string | number | null) {
		this.expression.is(column as COLUMNS[number], operation as never, value as never);
		this.filters[this.filters.length - 1] = " AND " + this.filters[this.filters.length - 1];
		return this;
	}
}
