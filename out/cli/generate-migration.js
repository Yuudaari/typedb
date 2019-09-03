"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp = __importStar(require("mkdirp"));
const mz_1 = require("mz");
const path = __importStar(require("path"));
const Config_1 = __importDefault(require("../Config"));
function default_1(table) {
    if (!table || !/^\w+$/.test(table)) {
        throw new Error(`Table name "${table}" is invalid.`);
    }
    const tablesDir = Config_1.default.getPath("tables");
    try {
        mkdirp.sync(tablesDir);
    }
    catch (err) {
        if (err.code === "EEXIST")
            throw new Error(`Can't create tables directory, a file already exists by that name.`);
    }
    ////////////////////////////////////
    // Create table directory if it doesn't already exist
    //
    const migrationsDir = Config_1.default.getPath("migrations");
    const tableMigrationsDir = path.join(migrationsDir, table);
    try {
        mkdirp.sync(tableMigrationsDir);
    }
    catch (err) {
        if (err.code === "EEXIST")
            throw new Error(`Can't create migrations directory for table "${table}", a file already exists by that name.`);
    }
    ////////////////////////////////////
    // Get previous table interface (for use in migration file)
    //
    const tableInterfaceFilePath = path.join(tablesDir, `${table}.ts`);
    let oldTableInterface;
    try {
        oldTableInterface = mz_1.fs.readFileSync(tableInterfaceFilePath, "utf8");
    }
    catch { }
    if (oldTableInterface) {
        const match = oldTableInterface.match(/^export default interface \w+ ({.*})\r?\n/sm);
        if (!match)
            throw new Error("Previous table interface file is invalid.");
        oldTableInterface = `interface From ${match[1]}`;
    }
    else {
        oldTableInterface = "type From = null;";
    }
    ////////////////////////////////////
    // Create table interface file
    //
    const tableInterfaceFile = `export default interface ${table} {

}
`;
    mz_1.fs.writeFileSync(tableInterfaceFilePath, tableInterfaceFile);
    ////////////////////////////////////
    // Create the new migrations file
    //
    const migrationsFilePath = path.join(tableMigrationsDir, `${Date.now()}.ts`);
    const migrationsFile = `import { Migration } from "typedb";
import ${table} from "${path.relative(path.dirname(migrationsFilePath), tableInterfaceFilePath).replace(/\\/g, "/").slice(0, -3)}";

${oldTableInterface}

export default new class extends Migration<From, ${table}> {
	public up () {

	}

	public down () {

	}
};
`;
    mz_1.fs.writeFileSync(migrationsFilePath, migrationsFile);
}
exports.default = default_1;
