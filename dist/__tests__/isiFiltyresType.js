"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils"); // Replace with your actual file path
describe('isFiltersType', () => {
    it('should return true for a valid Filters object with all properties', () => {
        const validFilters = {
            name: 'Test Name',
            author: 'Test Author',
            category: 'Test Category',
            genre: ['Genre1', 'Genre2'],
            formaturita: 'Test Formaturita',
            available: true,
        };
        expect((0, utils_1.isFiltersType)(validFilters)).toBe(true);
    });
    it('should return true for a valid Filters object with some properties missing', () => {
        const validFilters = {
            name: 'Test Name',
            available: false,
        };
        expect((0, utils_1.isFiltersType)(validFilters)).toBe(true);
    });
    it('should return true for an empty Filters object', () => {
        const validFilters = {};
        expect((0, utils_1.isFiltersType)(validFilters)).toBe(true);
    });
    it('should return false for an object with invalid property types', () => {
        const invalidFilters = {
            name: 123, // invalid type
            author: 'Test Author',
            category: 'Test Category',
            genre: 'Not an array', // invalid type
            formaturita: 'Test Formaturita',
            available: 'true', // invalid type
        };
        expect((0, utils_1.isFiltersType)(invalidFilters)).toBe(false);
    });
    it('should return false for a non-object value', () => {
        expect((0, utils_1.isFiltersType)(null)).toBe(false);
        expect((0, utils_1.isFiltersType)(undefined)).toBe(false);
        expect((0, utils_1.isFiltersType)('string')).toBe(false);
        expect((0, utils_1.isFiltersType)(123)).toBe(false);
        expect((0, utils_1.isFiltersType)([])).toBe(false);
    });
    it('should return true for a Filters object with undefined properties', () => {
        const validFilters = {
            name: undefined,
            author: undefined,
            category: undefined,
            genre: undefined,
            formaturita: undefined,
            available: undefined,
        };
        expect((0, utils_1.isFiltersType)(validFilters)).toBe(true);
    });
});
