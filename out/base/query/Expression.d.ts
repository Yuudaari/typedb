import { DataTypeArrayValue, DataTypeValue } from "../DataType";
import { Operations } from "../Operations";
export declare abstract class Expression<SCHEMA extends {
    [key: string]: any;
}> {
    protected readonly filters: (string | (() => string))[];
    abstract readonly is: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>;
    compile(): string;
    protected tweakLastFilter(tweaker: (filter: string) => string): void;
}
export declare abstract class ExpressionAndOr<SCHEMA extends {
    [key: string]: any;
}> {
    abstract readonly and: ExpressionBuilder<SCHEMA, this>;
    abstract readonly or: ExpressionBuilder<SCHEMA, this>;
}
declare type ColumnOperations<SCHEMA extends {
    [key: string]: any;
}, KEY extends keyof SCHEMA> = Operations<SCHEMA[KEY]> | "CONTAINS" | "==" | "!=";
export interface ExpressionBuilder<SCHEMA extends {
    [key: string]: any;
}, RETURN> {
    (initializer: (expr: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>) => any): RETURN;
    <KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>>(column: KEY, operation: OPERATION, ...args: ExpressionBuilderArguments<SCHEMA, KEY, OPERATION>): RETURN;
    not: ExpressionBuilder<SCHEMA, RETURN>;
}
declare type ExpressionBuilderArguments<SCHEMA extends {
    [key: string]: any;
}, KEY extends keyof SCHEMA, OPERATION extends ColumnOperations<SCHEMA, KEY>> = OPERATION extends "==" | "!=" ? [null] : OPERATION extends "BETWEEN" ? [DataTypeValue<SCHEMA[KEY]>, DataTypeValue<SCHEMA[KEY]>] : OPERATION extends "CONTAINS" ? [DataTypeArrayValue<SCHEMA[KEY]>] : OPERATION extends Operations<SCHEMA[KEY]> ? [DataTypeValue<SCHEMA[KEY]>] : never;
export declare type ExpressionBuilderFunction<RETURN, SCHEMA extends {
    [key: string]: any;
}> = (column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, value?: string | number | null, value2?: string | number | null, not?: boolean) => RETURN;
export declare function createExpressionBuilder<RETURN, SCHEMA extends {
    [key: string]: any;
}>(builder: ExpressionBuilderFunction<RETURN, SCHEMA>, addNot?: boolean): ExpressionBuilder<SCHEMA, RETURN>;
export {};
