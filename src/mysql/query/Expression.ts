// tslint:disable no-string-literal

import { createExpressionBuilder, Expression, ExpressionAndOr, ExpressionBuilder, ExpressionBuilderFunction } from "../../base/query/Expression";
import Override from "../../decorator/Override";

const operations: { [key: string]: string } = {
	"==": "=",
};

export class MySQLExpression<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> extends Expression<SCHEMA, COLUMNS> {
	public constructor (private readonly registerValue: (value?: string | number | null) => string) {
		super();
	}

	@Override public get is (): ExpressionBuilder<SCHEMA, COLUMNS, ExpressionAndOr<SCHEMA, COLUMNS>> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			const notString = not ? "NOT " : "";

			if (typeof column === "function") {
				const expr = new MySQLExpression<SCHEMA, COLUMNS>(this.registerValue);
				column(expr.is);
				this.filters.push(() => `(${notString}(${expr.compile()}))`);

			} else if (value === null) this.filters.push(`(${notString}${column} IS NULL)`);

			else if (operation === "BETWEEN") this.filters.push(() => `(${notString}${column} BETWEEN ${this.registerValue(value)} AND ${this.registerValue(value2)})`);

			else this.filters.push(() => `(${notString}${column} ${operations[`${operation}`] || operation} ${this.registerValue(value)})`);

			return new MySQLExpressionAndOr(this);
		});
	}
}

class MySQLExpressionAndOr<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[]> extends ExpressionAndOr<SCHEMA, COLUMNS> {

	public constructor (private readonly expression: MySQLExpression<SCHEMA, COLUMNS>) {
		super();
	}

	@Override public get and (): ExpressionBuilder<SCHEMA, COLUMNS, this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA, COLUMNS>)(column, operation, value, value2, not);
			this.expression["filters"][this.expression["filters"].length - 1] = " AND " + this.expression["filters"][this.expression["filters"].length - 1];
			return this;
		});
	}

	@Override public get or (): ExpressionBuilder<SCHEMA, COLUMNS, this> {
		return createExpressionBuilder((column, operation, value, value2, not) => {
			(this.expression.is as ExpressionBuilderFunction<any, SCHEMA, COLUMNS>)(column, operation, value, value2, not);
			this.expression["filters"][this.expression["filters"].length - 1] = " OR " + this.expression["filters"][this.expression["filters"].length - 1];
			return this;
		});
	}
}
