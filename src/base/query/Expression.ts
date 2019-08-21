import { DataTypeValue } from "../DataType";
import { Operations } from "./Select";

export abstract class Expression<SCHEMA extends { [key: string]: any }> {
	protected readonly filters: (string | (() => string))[] = [];

	public abstract get is (): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;

	public compile () {
		return this.filters.map(filter => typeof filter === "string" ? filter : filter())
			.join("");
	}
}

export abstract class ExpressionAndOr<SCHEMA extends { [key: string]: any }> {
	public abstract get and (): ExpressionBuilder<SCHEMA, this>;
	public abstract get or (): ExpressionBuilder<SCHEMA, this>;
}

export interface ExpressionBuilder<SCHEMA extends { [key: string]: any }, RETURN> {
	(initializer: (expr: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>) => any): RETURN;
	<KEY extends keyof SCHEMA> (column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): RETURN;
	<KEY extends keyof SCHEMA> (column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): RETURN;
	<KEY extends keyof SCHEMA> (column: KEY, operation: "==" | "!=", value: null): RETURN;

	not: ExpressionBuilder<SCHEMA, RETURN>;
}

export type ExpressionBuilderFunction<RETURN, SCHEMA extends { [key: string]: any }> =
	(column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, value?: string | number | null, value2?: string | number | null, not?: boolean) => RETURN;

export function createExpressionBuilder<RETURN, SCHEMA extends { [key: string]: any }>
	(builder: ExpressionBuilderFunction<RETURN, SCHEMA>, addNot = true) {

	const result = builder as any as ExpressionBuilder<SCHEMA, RETURN>;

	if (addNot) {
		result.not = createExpressionBuilder((column, operation, value, value2) => {
			return builder(column, operation, value, value2, true);
		}, false);
	}

	return result;
}
