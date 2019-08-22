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
const Select_1 = __importDefault(require("../../base/query/Select"));
const Bound_1 = __importDefault(require("../../decorator/Bound"));
const Override_1 = __importDefault(require("../../decorator/Override"));
const Expression_2 = require("./Expression");
class MySQLSelect extends Select_1.default {
    constructor(table, columns) {
        super();
        this.table = table;
        this.columns = columns;
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
    async queryOne() {
        const result = await this.limit(1).query();
        return result[0];
    }
    compile() {
        let query = `SELECT ${this.columns === "*" ? "*" : this.columns.join(",")} FROM ${this.table.name}`;
        const where = this.expression.compile();
        if (where)
            query += ` WHERE ${where}`;
        if (typeof this.limitAmount === "number")
            query += ` LIMIT ${this.limitAmount}`;
        return { query, values: this.values };
    }
    value(value) {
        this.values.push(value);
        return "?";
    }
}
__decorate([
    Override_1.default
], MySQLSelect.prototype, "where", null);
__decorate([
    Override_1.default
], MySQLSelect.prototype, "query", null);
__decorate([
    Override_1.default
], MySQLSelect.prototype, "queryOne", null);
__decorate([
    Bound_1.default
], MySQLSelect.prototype, "value", null);
exports.default = MySQLSelect;
