#!/usr/bin/env node

import chalk from "chalk";
import generateMigration from "./cli/generate-migration";
import migrate from "./cli/migrate";

const [, , subcommand, ...args] = process.argv;

switch (subcommand) {
	case "generate-migration":
		generateMigration(args[0]);
		break;
	case "migrate":
		migrate(args[0]);
		break;
}


process.on("uncaughtException", err => {
	console.log(chalk.red(err.message));
});
