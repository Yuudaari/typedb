"use strict";
// tslint:disable no-string-literal
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
const Override_1 = __importDefault(require("../../decorator/Override"));
const operations = {
    "==": "=",
    "~~": "=",
    "!~": "!=",
};
class MySQLExpression extends Expression_1.Expression {
    constructor(registerValue) {
        super();
        this.registerValue = registerValue;
    }
    get is() {
        return Expression_1.createExpressionBuilder((column, operation, value, value2, not) => {
            const notString = not ? "NOT " : "";
            if (typeof column === "function") {
                const expr = new MySQLExpression(this.registerValue);
                column(expr.is);
                this.filters.push(() => `(${notString}(${expr.compile()}))`);
            }
            else if (value === null)
                this.filters.push(`(${notString}${column} IS ${operation === "==" ? "" : "NOT"} NULL)`);
            else if (operation === "BETWEEN")
                this.filters.push(() => `(${notString}${column} BETWEEN ${this.registerValue(value)} AND ${this.registerValue(value2)})`);
            else if (operation === "~~" || operation === "!~")
                this.filters.push(() => `(${notString}lower(${column}) ${operations[`${operation}`] || operation} ${this.registerValue(`${value}`.toLowerCase())})`);
            else
                this.filters.push(() => `(${notString}${column} ${operations[`${operation}`] || operation} ${this.registerValue(value)})`);
            return new MySQLExpressionAndOr(this);
        });
    }
}
__decorate([
    Override_1.default
], MySQLExpression.prototype, "is", null);
exports.MySQLExpression = MySQLExpression;
class MySQLExpressionAndOr extends Expression_1.ExpressionAndOr {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    get and() {
        return Expression_1.createExpressionBuilder((column, operation, value, value2, not) => {
            this.expression.is(column, operation, value, value2, not);
            this.expression["tweakLastFilter"](filter => ` AND ${filter}`);
            return this;
        });
    }
    get or() {
        return Expression_1.createExpressionBuilder((column, operation, value, value2, not) => {
            this.expression.is(column, operation, value, value2, not);
            this.expression["tweakLastFilter"](filter => ` OR ${filter}`);
            return this;
        });
    }
}
__decorate([
    Override_1.default
], MySQLExpressionAndOr.prototype, "and", null);
__decorate([
    Override_1.default
], MySQLExpressionAndOr.prototype, "or", null);