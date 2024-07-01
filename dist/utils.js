"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenIfArrayOfArrays = void 0;
function flattenIfArrayOfArrays(value) {
    // Check if the value is an array and all its elements are arrays
    if (Array.isArray(value) && value.every(Array.isArray)) {
        // Flatten the array of arrays
        return value.flat();
    }
    // If value is not an array of arrays, return it as is
    return value;
}
exports.flattenIfArrayOfArrays = flattenIfArrayOfArrays;
