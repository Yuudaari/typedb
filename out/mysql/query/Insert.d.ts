import Insert, { ColumnsToValues } from "../../base/query/Insert";
import MySQLTable from "../Table";
export default class MySQLInsert<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Insert<SCHEMA, COLUMNS, any> {
    private readonly table;
    private readonly columns;
    private valuesToAdd;
    constructor(table: MySQLTable<SCHEMA>, columns: COLUMNS);
    values(...values: ColumnsToValues<SCHEMA, COLUMNS>): this;
    query(): Promise<never>;
}
