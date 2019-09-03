#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const generate_migration_1 = __importDefault(require("./cli/generate-migration"));
const migrate_1 = __importDefault(require("./cli/migrate"));
const [, , subcommand, ...args] = process.argv;
switch (subcommand) {
    case "generate-migration":
        generate_migration_1.default(args[0]);
        break;
    case "migrate":
        migrate_1.default(args[0]);
        break;
}
process.on("uncaughtException", err => {
    console.log(chalk_1.default.red(err.message));
});
