import { Expression, ExpressionAndOr, ExpressionBuilder } from "../../base/query/Expression";
export declare class PostgresExpression<SCHEMA extends {
    [key: string]: any;
}> extends Expression<SCHEMA> {
    private readonly registerValue;
    constructor(registerValue: (value?: string | number | null) => string);
    readonly is: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;
}
