import Insert from "./query/Insert";
import Select from "./query/Select";
import Update from "./query/Update";
export default abstract class Table<SCHEMA extends {
    [key: string]: any;
}, ALLOW_ZERO_COLUMN_SELECT extends boolean = false> {
    readonly name: string;
    constructor(name: string);
    abstract select(all: "*"): Select<SCHEMA>;
    abstract select<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): ALLOW_ZERO_COLUMN_SELECT extends true ? Select<SCHEMA, COLUMNS> : COLUMNS["length"] extends 0 ? never : Select<SCHEMA, COLUMNS>;
    abstract insert<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): Insert<SCHEMA, COLUMNS, any>;
    abstract update<COLUMNS extends (keyof SCHEMA)[]>(...columns: COLUMNS): Update<SCHEMA, any>;
    abstract query(query: string | {
        query: string;
        values: any[];
    }): Promise<any>;
}
