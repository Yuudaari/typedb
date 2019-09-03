import { Row } from "../DataType";
import { ExpressionBuilder } from "./Expression";
export default abstract class Select<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> {
    protected limitAmount?: number;
    abstract readonly where: ExpressionBuilder<SCHEMA, this>;
    limit(amt: number): this;
    abstract query(): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
    abstract queryOne(): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
}
