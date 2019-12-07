import { DataTypeArrayValue, DataTypeValue } from "../DataType";
import { Operations } from "../Operations";

export abstract class Expression<SCHEMA extends { [key: string]: any }> {
	protected readonly filters: (string | (() => string))[] = [];

	public abstract get is (): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;

	public compile () {
		return this.filters.map(filter => typeof filter === "string" ? filter : filter())
			.join("");
	}

	protected tweakLastFilter (tweaker: (filter: string) => string) {
		const existingFilter = this.filters[this.filters.length - 1];
		this.filters[this.filters.length - 1] = () => tweaker(typeof existingFilter === "string" ? existingFilter : existingFilter());
	}
}

export abstract class ExpressionAndOr<SCHEMA extends { [key: string]: any }> {
	public abstract get and (): ExpressionBuilder<SCHEMA, this>;
	public abstract get or (): ExpressionBuilder<SCHEMA, this>;
}

type ColumnOperations<SCHEMA extends { [key: string]: any }, KEY extends keyof SCHEMA> =
	Operations<SCHEMA[KEY]> | "CONTAINS" | "==" | "!=";

export interface ExpressionBuilder<SCHEMA extends { [key: string]: any }, RETURN> {
	(initializer: (expr: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>) => any): RETURN;
	<KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> (column: KEY, operation: OPERATION, ...args: ExpressionBuilderArguments<SCHEMA, KEY, OPERATION>): RETURN;

	not: ExpressionBuilder<SCHEMA, RETURN>;
}

type ExpressionBuilderArguments<SCHEMA extends { [key: string]: any }, KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> =
	OPERATION extends "==" | "!=" ? [null] :
	OPERATION extends "BETWEEN" ? [DataTypeValue<SCHEMA[KEY]>, DataTypeValue<SCHEMA[KEY]>] :
	OPERATION extends "CONTAINS" ? [DataTypeArrayValue<SCHEMA[KEY]>] :
	OPERATION extends Operations<SCHEMA[KEY]> ? [DataTypeValue<SCHEMA[KEY]>] :
	never;

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
