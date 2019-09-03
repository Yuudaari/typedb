"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("./mysql/Database"));
exports.MySQL = Database_1.default;
const Database_2 = __importDefault(require("./postgres/Database"));
exports.Postgres = Database_2.default;
