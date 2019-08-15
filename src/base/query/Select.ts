// tslint:disable no-string-literal

import { DataType, DataTypeValue } from "../DataType";
import Table from "../Table";

export enum Operation {
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

export type Operations<DATATYPE extends DataType> =
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

export type Result<SCHEMA, COLUMNS extends keyof SCHEMA> = {
	[COLUMN in COLUMNS]: SCHEMA[COLUMN] extends DataType ? DataTypeValue<SCHEMA[COLUMN]> : SCHEMA[COLUMN];
};

export default abstract class Select<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	public abstract where (initializer: (expr: Expression<SCHEMA, COLUMNS>["is"]) => any): this;
	public abstract where<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): this;
	public abstract where<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): this;
	public abstract where<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): this;

	public abstract query (): Promise<Result<SCHEMA, COLUMNS[number]>[]>;

	protected abstract compile (): { query: string; values: any[] };
	protected abstract getTable (): Table<SCHEMA>;
}

export abstract class Expression<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> {
	public abstract get is (): ExpressionBuilder<SCHEMA, COLUMNS, ExpressionAndOr<SCHEMA, COLUMNS>>;
}

export abstract class ExpressionAndOr<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> {
	public abstract get and (): ExpressionBuilder<SCHEMA, COLUMNS, this>;
	public abstract get or (): ExpressionBuilder<SCHEMA, COLUMNS, this>;
}

export interface ExpressionBuilder<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[], RETURN> {
	(initializer: (expr: ExpressionBuilder<SCHEMA, COLUMNS, ExpressionAndOr<SCHEMA, COLUMNS>>) => any): RETURN;
	<KEY extends COLUMNS[number]> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): RETURN;
	<KEY extends COLUMNS[number]> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): RETURN;
	<KEY extends COLUMNS[number]> (column: KEY, operation: "==", value: null): RETURN;

	not: ExpressionBuilder<SCHEMA, COLUMNS, RETURN>;
}

export type ExpressionBuilderFunction<RETURN extends ExpressionAndOr<SCHEMA, COLUMNS> | Expression<SCHEMA, COLUMNS>, SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> =
	(column: string | ((expr: ExpressionBuilder<SCHEMA, COLUMNS, any>) => any), operation?: string, value?: string | number | null, value2?: string | number | null, not?: boolean) => RETURN;

export function createExpressionBuilder<RETURN extends ExpressionAndOr<SCHEMA, COLUMNS> | Expression<SCHEMA, COLUMNS>, SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]>
	(builder: ExpressionBuilderFunction<RETURN, SCHEMA, COLUMNS>) {

	const result = builder as any as ExpressionBuilder<SCHEMA, COLUMNS, RETURN>;

	result.not = createExpressionBuilder((column, operation, value, value2) => {
		return builder(column, operation, value, value2, true);
	});

	return result;
}
