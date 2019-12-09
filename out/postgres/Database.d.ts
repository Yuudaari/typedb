import { Client, Pool, PoolClient } from "pg";
import PostgresTable from "./Table";
export default class PostgresDatabase<TABLES extends {
    [key: string]: any;
}> {
    private pool;
    constructor(pool: Client | Pool | PoolClient);
    setPool(pool: Client | Pool | PoolClient): this;
    getTable<N extends Extract<keyof TABLES, string>>(name: N, pool?: Pool | PoolClient | Client): PostgresTable<TABLES[N]>;
}
