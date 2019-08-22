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
const Expression_1 = require("../../base/query/Expression");
const Update_1 = __importDefault(require("../../base/query/Update"));
const Bound_1 = __importDefault(require("../../decorator/Bound"));
const Override_1 = __importDefault(require("../../decorator/Override"));
const Expression_2 = require("./Expression");
class MySQLUpdate extends Update_1.default {
    constructor(table) {
        super();
        this.table = table;
        this.expression = new Expression_2.MySQLExpression(this.value);
        this.values = [];
    }
    get where() {
        return Expression_1.createExpressionBuilder((column, operation, value, value2, not) => {
            this.expression.is(column, operation, value, value2, not);
            return this;
        });
    }
    async query() {
        return this.table.query(this.compile());
    }
    compile() {
        let query = `UPDATE ${this.table.name}`;
        if (!this.columnUpdates.length)
            throw new Error("No columns to update");
        query += ` SET ${this.columnUpdates.map(([column, value]) => `${column} = ${this.value(value)}`).join(", ")}`;
        const where = this.expression.compile();
        if (where)
            query += ` WHERE ${where}`;
        return { query, values: this.values };
    }
    value(value) {
        this.values.push(value);
        return "?";
    }
}
__decorate([
    Override_1.default
], MySQLUpdate.prototype, "where", null);
__decorate([
    Override_1.default
], MySQLUpdate.prototype, "query", null);
__decorate([
    Bound_1.default
], MySQLUpdate.prototype, "value", null);
exports.default = MySQLUpdate;
