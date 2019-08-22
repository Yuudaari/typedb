import { DataType, Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";
export declare enum Operation {
    "==" = 0,
    "!=" = 1,
    "<" = 2,
    ">" = 3,
    "<=" = 4,
    ">=" = 5,
    "BETWEEN" = 6
}
declare type NumericOperation = keyof typeof Operation;
declare type StringOperation = "==" | "!=";
export declare type Operations<DATATYPE extends DataType> = DATATYPE extends string ? StringOperation : DATATYPE extends string[] ? StringOperation : {
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
    [DataType.DATE]: NumericOperation;
    [DataType.DATETIME]: NumericOperation;
    [DataType.TIMESTAMP]: NumericOperation;
    [DataType.TIME]: NumericOperation;
    [DataType.YEAR]: NumericOperation;
    [DataType.CHAR]: StringOperation;
    [DataType.VARCHAR]: StringOperation;
    [DataType.BINARY]: StringOperation;
    [DataType.VARBINARY]: StringOperation;
    [DataType.BLOB]: StringOperation;
    [DataType.TEXT]: StringOperation;
}[Exclude<DATATYPE, DataType.NULL>];
export default abstract class Select<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {
    protected limitAmount?: number;
    abstract readonly where: ExpressionBuilder<SCHEMA, this>;
    limit(amt: number): this;
    abstract query(): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
    abstract queryOne(): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}
export {};
