import { DataTypeValue } from "../DataType";
import { ExpressionBuilder } from "./Expression";
export interface UpdateColumns<SCHEMA extends {
    [key: string]: any;
}> {
    column<COLUMN extends keyof SCHEMA>(column: COLUMN, value: DataTypeValue<SCHEMA[COLUMN]>): this;
}
export default abstract class Update<SCHEMA extends {
    [key: string]: any;
}, RETURN> implements UpdateColumns<SCHEMA> {
    protected readonly columnUpdates: [keyof SCHEMA, any][];
    abstract readonly where: ExpressionBuilder<SCHEMA, this>;
    column<COLUMN extends keyof SCHEMA>(column: COLUMN, value: DataTypeValue<SCHEMA[COLUMN]>): this;
    columns(initializer: (update: UpdateColumns<SCHEMA>) => any): this;
    abstract query(): Promise<RETURN>;
}
