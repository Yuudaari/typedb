// tslint:disable no-string-literal

import { Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";

export default abstract class Select<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	protected limitAmount?: number;

	public abstract get where (): ExpressionBuilder<SCHEMA, this>;

	public limit (amt: number) {
		this.limitAmount = amt;
		return this;
	}

	public abstract query (): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
	public abstract queryOne (): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}
