import { Client, Pool, PoolClient, QueryResult } from "pg";
import Table from "../base/Table";
import PostgresInsert from "./query/Insert";
import PostgresSelect from "./query/Select";
import PostgresUpdate from "./query/Update";
export default class PostgresTable<SCHEMA extends {
    [key: string]: any;
}> extends Table<SCHEMA, true> {
    readonly name: string;
    private readonly pool;
    constructor(name: string, pool: Client | Pool | PoolClient);
    select(all: "*"): PostgresSelect<SCHEMA>;
    select<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): PostgresSelect<SCHEMA, COLUMNS>;
    /**
     * Note: Unlike with plain SQL, you *must* specify the columns you will modify.
     * This is because the parameters in `values` calls can't be strictly typed unless the column order is known, and it's not.
     */
    insert<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): COLUMNS["length"] extends 0 ? never : PostgresInsert<SCHEMA, COLUMNS>;
    update(): PostgresUpdate<SCHEMA, []>;
    query(query: string | {
        query: string;
        values: any[];
    }): Promise<QueryResult>;
    query(pool: Client | Pool | PoolClient, query: string | {
        query: string;
        values: any[];
    }): Promise<QueryResult>;
}
