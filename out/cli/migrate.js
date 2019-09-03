"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../Config"));
function default_1(table) {
    if (table && !/^\w+$/.test(table)) {
        throw new Error("Table name is invalid.");
    }
    const config = Config_1.default.get();
    config;
}
exports.default = default_1;
