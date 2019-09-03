"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Expression {
    constructor() {
        this.filters = [];
    }
    compile() {
        return this.filters.map(filter => typeof filter === "string" ? filter : filter())
            .join("");
    }
    tweakLastFilter(tweaker) {
        const existingFilter = this.filters[this.filters.length - 1];
        this.filters[this.filters.length - 1] = () => tweaker(typeof existingFilter === "string" ? existingFilter : existingFilter());
    }
}
exports.Expression = Expression;
class ExpressionAndOr {
}
exports.ExpressionAndOr = ExpressionAndOr;
function createExpressionBuilder(builder, addNot = true) {
    const result = builder;
    if (addNot) {
        result.not = createExpressionBuilder((column, operation, value, value2) => {
            return builder(column, operation, value, value2, true);
        }, false);
    }
    return result;
}
exports.createExpressionBuilder = createExpressionBuilder;
