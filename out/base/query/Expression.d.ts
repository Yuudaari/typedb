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
export interface ExpressionBuilder<SCHEMA extends {
    [key: string]: any;
}, RETURN> {
    (initializer: (expr: ExpressionBuilder<SCHEMA, ExpressionAndOr<SCHEMA>>) => any): RETURN;
    <KEY extends keyof SCHEMA>(column: KEY, operation: Operations<SCHEMA[KEY]>, value: DataTypeValue<SCHEMA[KEY]>): RETURN;
    <KEY extends keyof SCHEMA>(column: KEY, operation: "CONTAINS", value: DataTypeArrayValue<SCHEMA[KEY]>): RETURN;
    <KEY extends keyof SCHEMA>(column: KEY, operation: "IN", value: DataTypeValue<SCHEMA[KEY]>[]): RETURN;
    <KEY extends keyof SCHEMA>(column: KEY, operation: "BETWEEN", value1: DataTypeValue<SCHEMA[KEY]>, value2: DataTypeValue<SCHEMA[KEY]>): RETURN;
    <KEY extends keyof SCHEMA>(column: KEY, operation: "==" | "!=", value: null): RETURN;
    not: ExpressionBuilder<SCHEMA, RETURN>;
}
export declare type ExpressionBuilderFunction<RETURN, SCHEMA extends {
    [key: string]: any;
}> = (column: string | ((expr: ExpressionBuilder<SCHEMA, any>) => any), operation?: string, value?: string | number | null, value2?: string | number | null, not?: boolean) => RETURN;
export declare function createExpressionBuilder<RETURN, SCHEMA extends {
    [key: string]: any;
}>(builder: ExpressionBuilderFunction<RETURN, SCHEMA>, addNot?: boolean): ExpressionBuilder<SCHEMA, RETURN>;
