"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInTruthyValues = void 0;
const isInTruthyValues = (value) => {
    if (!value) {
        return 'false';
    }
    const lowerCaseValue = value.toString().toLowerCase();
    return ['yes', 'true', true, 'ano', '1'].includes(lowerCaseValue).toString();
};
exports.isInTruthyValues = isInTruthyValues;
