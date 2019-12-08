import { ExpressionBuilder } from "../../base/query/Expression";
import Update from "../../base/query/Update";
import MySQLTable from "../Table";
export default class MySQLUpdate<SCHEMA extends {
    [key: string]: any;
}> extends Update<SCHEMA, number> {
    private readonly table;
    private readonly expression;
    private readonly values;
    constructor(table: MySQLTable<SCHEMA>);
    get where(): ExpressionBuilder<SCHEMA, this>;
    query(): Promise<any>;
    private compile;
    private value;
}
