"use strict";
/// <reference types="mocha" />
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
const chai = __importStar(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const del_1 = __importDefault(require("del"));
const mkdirp = __importStar(require("mkdirp"));
const fs = __importStar(require("mz/fs"));
const generate_migration_1 = __importDefault(require("../cli/generate-migration"));
const migrate_1 = __importDefault(require("../cli/migrate"));
const Config_1 = __importDefault(require("../Config"));
chai.use(chai_as_promised_1.default);
const expect = chai.expect;
describe("CLI", () => {
    before(async () => {
        process.chdir(__dirname);
        del_1.default.sync("tmp");
        mkdirp.sync("tmp");
        process.chdir("tmp");
    });
    after(() => {
        process.chdir(__dirname);
        // del.sync("tmp");
    });
    function setConfig(config) {
        if (!config) {
            try {
                fs.unlinkSync("typedb.json");
            }
            catch (err) {
                if (err.code !== "ENOENT")
                    throw err;
            }
        }
        else {
            fs.writeFileSync("typedb.json", JSON.stringify(config));
        }
    }
    beforeEach(() => {
        // tslint:disable-next-line no-string-literal
        delete Config_1.default["config"];
        setConfig({});
    });
    describe("against cwd with no typedb.json config should error for", () => {
        it("command generate-migration", () => {
            setConfig();
            expect(() => generate_migration_1.default("people")).throws();
        });
        it("command migrate", () => {
            setConfig();
            expect(migrate_1.default).throws();
        });
    });
    describe("command generate-migration", () => {
        it("should error with an invalid table name", () => {
            expect(() => generate_migration_1.default("!@#%")).throws("Table name \"!@#%\" is invalid.");
        });
        it("should error with no table provided", () => {
            expect(() => generate_migration_1.default()).throws("Table name \"undefined\" is invalid.");
        });
        it("should generate an interface and a migration file", () => {
            generate_migration_1.default("people");
        });
    });
    describe("command migrate", () => {
        it("should error with an invalid table name", () => {
            expect(() => generate_migration_1.default("!@#%")).throws("Table name \"!@#%\" is invalid.");
        });
    });
});
