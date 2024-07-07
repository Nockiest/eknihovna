"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils"); // Replace with your actual file path
describe("isFiltersType function", () => {
    test("should return false for an object with invalid 'genre' property", () => {
        const invalidFilters = {
            name: "Test Book",
            author: "John Doe",
            category: "Fiction",
            genre: "Science Fiction", // Invalid: genre should be an array
            formaturita: "PDF",
            available: true,
        };
        expect((0, utils_1.isFiltersType)(invalidFilters)).toBe(false);
    });
    test("should return true for a valid Filters object", () => {
        const validFilters = {
            name: "Test Book",
            author: "John Doe",
            category: "Fiction",
            genre: ["Science Fiction", "Adventure"],
            formaturita: "PDF",
            available: true,
        };
        expect((0, utils_1.isFiltersType)(validFilters)).toBe(true);
    });
    // Additional tests for other properties
    test("should return false for an object without 'name' property", () => {
        const filtersWithoutName = {
            author: "John Doe",
            category: "Fiction",
            genre: ["Science Fiction"],
            formaturita: "PDF",
            available: true,
        };
        expect((0, utils_1.isFiltersType)(filtersWithoutName)).toBe(false);
    });
    test("should return false for an object without 'author' property", () => {
        const filtersWithoutAuthor = {
            name: "Test Book",
            category: "Fiction",
            genre: ["Science Fiction"],
            formaturita: "PDF",
            available: true,
        };
        expect((0, utils_1.isFiltersType)(filtersWithoutAuthor)).toBe(false);
    });
    test("should return false for an object without 'category' property", () => {
        const filtersWithoutCategory = {
            name: "Test Book",
            author: "John Doe",
            genre: ["Science Fiction"],
            formaturita: "PDF",
            available: true,
        };
        expect((0, utils_1.isFiltersType)(filtersWithoutCategory)).toBe(false);
    });
});
