"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataType_1 = require("./DataType");
var NumericOperations;
(function (NumericOperations) {
    NumericOperations[NumericOperations["=="] = 0] = "==";
    NumericOperations[NumericOperations["!="] = 1] = "!=";
    NumericOperations[NumericOperations["<"] = 2] = "<";
    NumericOperations[NumericOperations[">"] = 3] = ">";
    NumericOperations[NumericOperations["<="] = 4] = "<=";
    NumericOperations[NumericOperations[">="] = 5] = ">=";
    NumericOperations[NumericOperations["BETWEEN"] = 6] = "BETWEEN";
})(NumericOperations || (NumericOperations = {}));
var StringOperations;
(function (StringOperations) {
    StringOperations[StringOperations["=="] = 0] = "==";
    StringOperations[StringOperations["!="] = 1] = "!=";
    StringOperations[StringOperations["~~"] = 2] = "~~";
    StringOperations[StringOperations["!~"] = 3] = "!~";
})(StringOperations || (StringOperations = {}));
