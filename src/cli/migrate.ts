import Config from "../Config";

export default function (table?: string) {
	if (table && !/^\w+$/.test(table)) {
		throw new Error("Table name is invalid.");
	}

	const config = Config.get();
	config;
}
