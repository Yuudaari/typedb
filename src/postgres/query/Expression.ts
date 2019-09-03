// tslint:disable no-string-literal

import { createExpressionBuilder, Expression, ExpressionAndOr, ExpressionBuilder, ExpressionBuilderFunction } from "../../base/query/Expression";
import Override from "../../decorator/Override";

const operations: { [key: string]: string } = {
	"==": "=",
	"~~": "=",
	"!~": "!=",
};

export class PostgresExpression<SCHEMA extends { [key: string]: any }> extends Expression<SCHEMA> {

	public constructor (private readonly registerValue: (value?: string | number | null) => string) {
		super();
	}

	@Override public get is (): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			const notString = not ? "NOT " : "";

			if (typeof column === "function") {
				const expr = new PostgresExpression<SCHEMA>(this.registerValue);
				column(expr.is);
				this.filters.push(() => `(${notString}(${expr.compile()}))`);

			} else if (value === null)
				this.filters.push(`(${notString}${column} IS ${operation === "==" ? "" : "NOT"} NULL)`);

			else if (operation === "CONTAINS")
				this.filters.push(() => `(${notString}${column} = ANY(${this.registerValue(value)}))`);

			else if (operation === "BETWEEN")
				this.filters.push(() => `(${notString}${column} BETWEEN ${this.registerValue(value)} AND ${this.registerValue(value2)})`);

			else if (operation === "~~" || operation === "!~")
				this.filters.push(() => `(${notString}lower(${column}) ${operations[`${operation}`] || operation} ${this.registerValue(`${value}`.toLowerCase())})`);

			else this.filters.push(() => `(${notString}${column} ${operations[`${operation}`] || operation} ${this.registerValue(value)})`);

			return new PostgresExpressionAndOr(this);
		});
	}
}

class PostgresExpressionAndOr<SCHEMA extends { [key: string]: any }> extends ExpressionAndOr<SCHEMA> {

	public constructor (private readonly expression: PostgresExpression<SCHEMA>) {
		super();
	}

	@Override public get and (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA>)(column, operation, value, value2, not);
			this.expression["tweakLastFilter"](filter => ` AND ${filter}`);
			return this;
		});
	}

	@Override public get or (): ExpressionBuilder<SCHEMA, this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA>)(column, operation, value, value2, not);
			this.expression["tweakLastFilter"](filter => ` OR ${filter}`);
			return this;
		});
	}
}
