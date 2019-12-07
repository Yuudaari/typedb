import { DataType } from "./DataType";

enum NumericOperations {
	"==",
	"!=",
	"<",
	">",
	"<=",
	">=",
	"BETWEEN",
}

enum StringOperations {
	"==",
	"!=",
	"~~",
	"!~",
	"IN",
	"HAS_SUBSTR",
	"IS_SUBSTR",
}

type NumericOperation = keyof typeof NumericOperations;

type StringOperation = keyof typeof StringOperations;

export type Operations<DATATYPE extends DataType> =
	DATATYPE extends string ? StringOperation :
	DATATYPE extends string[] ? StringOperation :
	DATATYPE extends any[] ? never : {
		// numeric
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

		// datetime
		[DataType.DATE]: NumericOperation;
		[DataType.DATETIME]: NumericOperation;
		[DataType.TIMESTAMP]: NumericOperation;
		[DataType.TIME]: NumericOperation;
		[DataType.YEAR]: NumericOperation;

		// string
		[DataType.CHAR]: StringOperation;
		[DataType.VARCHAR]: StringOperation;
		[DataType.BINARY]: StringOperation;
		[DataType.VARBINARY]: StringOperation;
		[DataType.BLOB]: StringOperation;
		[DataType.TEXT]: StringOperation;
	}[Exclude<DATATYPE, DataType.NULL>];
