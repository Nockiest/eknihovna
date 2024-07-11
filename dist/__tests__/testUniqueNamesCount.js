"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Mock the query function to return a specific result set
jest.mock("../db", () => ({
    query: jest.fn().mockResolvedValue({
        rows: [
            { name: "Book 1", auhtor: 'adam' },
            { name: "Book 2", auhtor: 'eva' },
        ],
    }),
}));
describe("GET /uniqueNamesCount endpoint", () => {
    it("should return the count of unique names correctly when multiple rows are present", () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { query: {} };
        const response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        yield require("../app").default(request, response);
        expect(response.status).not.toHaveBeenCalledWith(404);
        expect(response.status).not.toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith(2);
    }));
    it("should return a 404 status when no data is found", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.mock("./db", () => ({
            query: jest.fn().mockResolvedValue({ rows: [] }),
        }));
        const request = { query: {} };
        const response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        yield require("../app").default(request, response);
        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledWith({ error: "No data found" });
    }));
    it("should return a 500 status when an error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.mock("./db", () => ({
            query: jest.fn().mockRejectedValue(new Error("Database error")),
        }));
        const request = { query: {} };
        const response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        yield require("../app").default(request, response);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    }));
    it("should handle a result set with more than one row", () => __awaiter(void 0, void 0, void 0, function* () {
        const request = { query: {} };
        const response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        yield require("../app").default(request, response);
        expect(response.status).not.toHaveBeenCalledWith(404);
        expect(response.status).not.toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({ uniqueNamesCount: 30 });
    }));
    it("should handle a result set with only one row", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.mock("../db", () => ({
            query: jest.fn().mockResolvedValue({
                rows: [{ name: "Book 1", uniquenamescount: 1 }],
            }),
        }));
        const request = { query: {} };
        const response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        yield require("../app").default(request, response);
        expect(response.status).not.toHaveBeenCalledWith(404);
        expect(response.status).not.toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith(2);
    }));
});
