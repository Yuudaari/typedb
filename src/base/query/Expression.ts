import { DataTypeValue } from "../DataType";
import { Operations } from "./Select";

export abstract class Expression<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> {
	protected readonly filters: (string | (() => string))[] = [];

	public abstract get is (): ExpressionBuilder<SCHEMA, COLUMNS, ExpressionAndOr<SCHEMA, COLUMNS>>;

	public compile () {
		return this.filters.map(filter => typeof filter === "string" ? filter : filter())
			.join("");
	}
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

export type ExpressionBuilderFunction<RETURN, SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> =
	(column: string | ((expr: ExpressionBuilder<SCHEMA, COLUMNS, any>) => any), operation?: string, value?: string | number | null, value2?: string | number | null, not?: boolean) => RETURN;

export function createExpressionBuilder<RETURN, SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]>
	(builder: ExpressionBuilderFunction<RETURN, SCHEMA, COLUMNS>, addNot = true) {

	const result = builder as any as ExpressionBuilder<SCHEMA, COLUMNS, RETURN>;

	if (addNot) {
		result.not = createExpressionBuilder((column, operation, value, value2) => {
			return builder(column, operation, value, value2, true);
		}, false);
	}

	return result;
}
