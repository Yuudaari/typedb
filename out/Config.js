"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const json = __importStar(require("jsonfile"));
const path = __importStar(require("path"));
exports.defaultConfig = {
    paths: {
        root: "",
        tables: "tables",
        migrations: "tables/migrations",
    },
};
exports.default = new class {
    getPath(pathName, cwd = process.cwd()) {
        const config = this.get();
        if (pathName === "root")
            return config.paths.root;
        return path.join(config.paths.root, config.paths[pathName]);
    }
    get(cwd) {
        if (cwd === undefined)
            cwd = this.cwd = this.cwd || process.cwd();
        else if (cwd !== this.cwd)
            this.cwd = cwd; // switch to a config in a new location
        else if (this.config)
            return this.config; // this config was already loaded
        while (true) {
            try {
                this.config = deepmerge_1.default(exports.defaultConfig, json.readFileSync(path.join(this.cwd, "typedb.json")));
                // if we made it this far, we successfully found the typedb.json
                return this.config;
            }
            catch {
                // there was no typedb.json in the cwd, so we need to move up a folder to try again
                const dirname = path.dirname(this.cwd);
                // if the parent folder is the same as the current folder, we've reached the root
                if (dirname === this.cwd)
                    break;
                // if not, we set the cwd to the parent and continue
                this.cwd = dirname;
            }
        }
        delete this.cwd;
        throw new Error("No typedb.json config file found.");
    }
};
