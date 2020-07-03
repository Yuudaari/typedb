import { Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";
export default abstract class Select<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {
    protected limitAmount?: number;
    protected orderBy?: OrderBy<COLUMNS[number]>;
    abstract get where(): ExpressionBuilder<SCHEMA, this>;
    limit(amt: number): this;
    order(orderer: (by: OrderBy<COLUMNS[number]>["then"]) => any): this;
    abstract query(): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
    abstract queryOne(): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}
declare class OrderBy<COLUMN extends string | number | symbol = string | number | symbol> {
    protected order: [COLUMN, ("asc" | "desc")?][];
    then(column: COLUMN): this;
    then(column: COLUMN, direction: "asc" | "desc"): this;
}
export {};
