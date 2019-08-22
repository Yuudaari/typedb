"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = __importDefault(require("../base/Table"));
const Override_1 = __importDefault(require("../decorator/Override"));
const Insert_1 = __importDefault(require("./query/Insert"));
const Select_1 = __importDefault(require("./query/Select"));
const Update_1 = __importDefault(require("./query/Update"));
class PostgresTable extends Table_1.default {
    constructor(name, pool) {
        super(name);
        this.name = name;
        this.pool = pool;
    }
    select(...columns) {
        return new Select_1.default(this, columns);
    }
    /**
     * Note: Unlike with plain SQL, you *must* specify the columns you will modify.
     * This is because the parameters in `values` calls can't be strictly typed unless the column order is known, and it's not.
     */
    insert(...columns) {
        return new Insert_1.default(this, columns);
    }
    update() {
        return new Update_1.default(this);
    }
    async query(pool, query) {
        if (pool && (typeof pool !== "object" || {}.constructor === pool.constructor)) {
            query = pool;
            pool = this.pool;
        }
        let values = [];
        if (typeof query === "object") {
            values = query.values;
            query = query.query;
        }
        console.log(query, values);
        return new Promise((resolve, reject) => (pool || this.pool).query({ text: query, values }, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        }));
    }
}
__decorate([
    Override_1.default
], PostgresTable.prototype, "select", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "insert", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "update", null);
__decorate([
    Override_1.default
], PostgresTable.prototype, "query", null);
exports.default = PostgresTable;
