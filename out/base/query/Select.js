"use strict";
// tslint:disable no-string-literal
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("../DataType");
var Operation;
(function (Operation) {
    Operation[Operation["=="] = 0] = "==";
    Operation[Operation["!="] = 1] = "!=";
    Operation[Operation["<"] = 2] = "<";
    Operation[Operation[">"] = 3] = ">";
    Operation[Operation["<="] = 4] = "<=";
    Operation[Operation[">="] = 5] = ">=";
    Operation[Operation["BETWEEN"] = 6] = "BETWEEN";
})(Operation = exports.Operation || (exports.Operation = {}));
class Select {
    limit(amt) {
        this.limitAmount = amt;
        return this;
    }
}
exports.default = Select;
