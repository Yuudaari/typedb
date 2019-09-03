import { Connection, FieldInfo, PoolConnection } from "mysql";
import Table from "../base/Table";
import MySQLInsert from "./query/Insert";
import MySQLSelect from "./query/Select";
import MySQLUpdate from "./query/Update";
export default class MySQLTable<SCHEMA extends {
    [key: string]: any;
}> extends Table<SCHEMA> {
    readonly name: string;
    private readonly pool;
    constructor(name: string, pool: Connection | PoolConnection);
    insert<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): MySQLInsert<SCHEMA, COLUMNS>;
    select(all: "*"): MySQLSelect<SCHEMA>;
    select<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): COLUMNS["length"] extends 0 ? never : MySQLSelect<SCHEMA, COLUMNS>;
    update(): MySQLUpdate<SCHEMA>;
    query(query: string | {
        query: string;
        values: any[];
    }): Promise<any[]>;
    query(query: string | {
        query: string;
        values: any[];
    }, fields: true): Promise<{
        results: any[];
        fields: FieldInfo[];
    }>;
}
