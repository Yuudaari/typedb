import { Connection, PoolConnection } from "mysql";
import MySQLTable from "./Table";
export default class MySQLDatabase<TABLES extends {
    [key: string]: any;
}> {
    private pool;
    constructor(pool: Connection | PoolConnection);
    setPool(pool: Connection | PoolConnection): this;
    getTable<N extends Extract<keyof TABLES, string>>(name: N, pool?: Connection | PoolConnection): MySQLTable<TABLES[N]>;
}
