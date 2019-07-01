import { DataType } from "./DataType";

export default class Column<DATATYPE extends DataType | string | string[]> {
	public constructor (public readonly name: string, public readonly dataType: DATATYPE) { }


}
