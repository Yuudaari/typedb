// tslint:disable no-string-literal

import Bound from "../../decorator/Bound";
import { Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";

export default abstract class Select<SCHEMA extends { [key: string]: any }, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {

	protected limitAmount?: number;
	protected orderBy?: OrderBy<COLUMNS[number]>;

	public abstract get where (): ExpressionBuilder<SCHEMA, this>;

	public limit (amt: number) {
		this.limitAmount = amt;
		return this;
	}

	public order (orderer: (by: OrderBy<COLUMNS[number]>["then"]) => any) {
		this.orderBy = new OrderBy();
		orderer(this.orderBy.then);
		return this;
	}

	public abstract query (): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
	public abstract queryOne (): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}

class OrderBy<COLUMN extends string | number | symbol = string | number | symbol> {
	protected order: [COLUMN, ("asc" | "desc")?][] = [];

	public then (column: COLUMN): this;
	public then (column: COLUMN, direction: "asc" | "desc"): this;
	@Bound public then (...args: [COLUMN, ("asc" | "desc")?]) {
		this.order.push(args);
		return this;
	}
}

