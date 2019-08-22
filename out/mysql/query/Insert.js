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
const Insert_1 = __importDefault(require("../../base/query/Insert"));
const Override_1 = __importDefault(require("../../decorator/Override"));
class MySQLInsert extends Insert_1.default {
    // @ts-ignore
    constructor(table, columns) {
        this.table = table;
        this.columns = columns;
        this.valuesToAdd = [];
    }
    values(...values) {
        this.valuesToAdd.push(values);
        return this;
    }
    async query() {
        throw new Error("Unimplemented");
    }
}
__decorate([
    Override_1.default
], MySQLInsert.prototype, "values", null);
__decorate([
    Override_1.default
], MySQLInsert.prototype, "query", null);
exports.default = MySQLInsert;
