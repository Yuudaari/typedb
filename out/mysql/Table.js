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
class MySQLTable extends Table_1.default {
    constructor(name, pool) {
        super(name);
        this.name = name;
        this.pool = pool;
    }
    insert(...columns) {
        return new Insert_1.default(this, columns);
    }
    select(...columns) {
        return new Select_1.default(this, columns);
    }
    update() {
        return new Update_1.default(this);
    }
    async query(query, includeFields = false) {
        let values = [];
        if (typeof query === "object") {
            values = query.values;
            query = query.query;
        }
        console.log(query, values);
        return new Promise((resolve, reject) => this.pool.query(query, values, (err, results, fields) => {
            if (err)
                reject(err);
            if (includeFields)
                resolve({ results, fields });
            else
                resolve(results);
        }));
    }
}
__decorate([
    Override_1.default
], MySQLTable.prototype, "insert", null);
__decorate([
    Override_1.default
], MySQLTable.prototype, "select", null);
__decorate([
    Override_1.default
], MySQLTable.prototype, "update", null);
__decorate([
    Override_1.default
], MySQLTable.prototype, "query", null);
exports.default = MySQLTable;
