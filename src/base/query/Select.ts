// tslint:disable no-string-literal

import { DataType, Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";

export enum Operation {
	"==",
	"!=",
	"<",
	">",
	"<=",
	">=",
	"BETWEEN",
}

type NumericOperation = keyof typeof Operation;

type StringOperation = "==" | "!=";

export type Operations<DATATYPE extends DataType> =
	DATATYPE extends string ? StringOperation :
	DATATYPE extends string[] ? StringOperation : {
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
	}[DATATYPE];

export default abstract class Select<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	protected limitAmount?: number;

	public abstract get where (): ExpressionBuilder<SCHEMA, COLUMNS, this>;

	public limit (amt: number) {
		this.limitAmount = amt;
		return this;
	}

	public abstract query (): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
	public abstract queryOne (): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}
