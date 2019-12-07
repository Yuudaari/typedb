import { DataType } from "./DataType";
declare enum NumericOperations {
    "==" = 0,
    "!=" = 1,
    "<" = 2,
    ">" = 3,
    "<=" = 4,
    ">=" = 5,
    "BETWEEN" = 6
}
declare enum StringOperations {
    "==" = 0,
    "!=" = 1,
    "~~" = 2,
    "!~" = 3,
    "IN" = 4,
    "HAS_SUBSTR" = 5,
    "IS_SUBSTR" = 6
}
declare type NumericOperation = keyof typeof NumericOperations;
declare type StringOperation = keyof typeof StringOperations;
export declare type Operations<DATATYPE extends DataType> = DATATYPE extends string ? StringOperation : DATATYPE extends string[] ? StringOperation : DATATYPE extends any[] ? never : {
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
export {};
