import { Expression, ExpressionAndOr, ExpressionBuilder } from "../../base/query/Expression";
export declare class MySQLExpression<SCHEMA extends {
    [key: string]: any;
}> extends Expression<SCHEMA> {
    private readonly registerValue;
    constructor(registerValue: (value?: string | number | null) => string);
    get is(): ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;
}
