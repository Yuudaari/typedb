import { Row } from "../../base/DataType";
import { ExpressionBuilder } from "../../base/query/Expression";
import Select from "../../base/query/Select";
import MySQLTable from "../Table";
export default class MySQLSelect<SCHEMA extends {
    [key: string]: any;
}, COLUMNS extends (keyof SCHEMA)[] = (keyof SCHEMA)[]> extends Select<SCHEMA, COLUMNS> {
    private readonly table;
    private readonly columns;
    private readonly expression;
    private readonly values;
    constructor(table: MySQLTable<SCHEMA>, columns: "*" | COLUMNS);
    get where(): ExpressionBuilder<SCHEMA, this>;
    query(): Promise<Row<SCHEMA, COLUMNS[number]>[]>;
    queryOne(): Promise<Row<SCHEMA, COLUMNS[number]> | undefined>;
    private compile;
    private value;
}
