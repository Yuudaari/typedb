import { Client, Pool, PoolClient, QueryResult } from "pg";
import { Row } from "../../base/DataType";
import { ExpressionBuilder } from "../../base/query/Expression";
import Update from "../../base/query/Update";
import Overwrite from "../../type/Overwrite";
import PostgresTable from "../Table";
export default class PostgresUpdate<SCHEMA extends {
    [key: string]: any;
}, RETURN_COLUMNS extends (keyof SCHEMA)[] = []> extends Update<SCHEMA, number | Row<SCHEMA, RETURN_COLUMNS[number]>[] | Overwrite<QueryResult, {
    rows: Row<SCHEMA, RETURN_COLUMNS[number]>[];
}>> {
    private readonly table;
    private readonly expression;
    private readonly values;
    private returnColumns;
    constructor(table: PostgresTable<SCHEMA>);
    readonly where: ExpressionBuilder<SCHEMA, this>;
    returning<COLUMNS_NEW extends (keyof SCHEMA)[] | ["*"]>(...columns: COLUMNS_NEW): PostgresUpdate<SCHEMA, COLUMNS_NEW extends ["*"] ? (keyof SCHEMA)[] : COLUMNS_NEW>;
    query(pool?: Client | Pool | PoolClient): Promise<RETURN_COLUMNS["length"] extends 0 ? number : Row<SCHEMA, RETURN_COLUMNS[number]>[]>;
    query(pool: Client | Pool | PoolClient | undefined, resultObject: true): Promise<Overwrite<QueryResult, {
        rows: Row<SCHEMA, RETURN_COLUMNS[number]>[];
    }>>;
    private compile;
    private value;
}
