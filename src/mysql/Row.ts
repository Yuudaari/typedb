import { DataTypeValue } from "./DataType";

export default class Row<SCHEMA extends { [key: string]: any; }> {

	private pendingAssignments: [string, DataTypeValue<number | string | string[]>][] = [];

	public setColumn<KEY extends Extract<keyof SCHEMA, string>> (key: KEY, value: DataTypeValue<SCHEMA[KEY]>) {
		this.pendingAssignments.push([key, value]);
		return this;
	}

	public getPendingAssignments () {
		return this.pendingAssignments;
	}

	public clearPendingAssignments () {
		this.pendingAssignments.splice(0, Infinity);
		return this;
	}
}
