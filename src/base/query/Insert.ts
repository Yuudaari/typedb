import { DataType, DataTypeValue } from "../DataType";

export type ColumnsToValues<SCHEMA extends { [key: string]: any }, COLUMNS extends any[], ALLOW_EXPRESSIONS extends boolean = false> = {
	[index in keyof COLUMNS]: DataTypeValue<Extract<SCHEMA[Extract<COLUMNS[index], keyof SCHEMA>], DataType>>;
};

export default abstract class Insert<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	public abstract values (...values: ColumnsToValues<SCHEMA, COLUMNS>): this;

	public async query () {

	}
}
