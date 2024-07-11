import { query } from "../db"; // Assuming query is imported from the db module

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
  it("should return the count of unique names correctly when multiple rows are present", async () => {
    const request = { query: {} };
    const response = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await require("../app").default(request, response);

    expect(response.status).not.toHaveBeenCalledWith(404);
    expect(response.status).not.toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(2);
  });

  it("should return a 404 status when no data is found", async () => {
    jest.mock("./db", () => ({
      query: jest.fn().mockResolvedValue({ rows: [] }),
    }));

    const request = { query: {} };
    const response = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await require("../app").default(request, response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({ error: "No data found" });
  });

  it("should return a 500 status when an error occurs", async () => {
    jest.mock("./db", () => ({
      query: jest.fn().mockRejectedValue(new Error("Database error")),
    }));

    const request = { query: {} };
    const response = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await require("../app").default(request, response);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
  });

  it("should handle a result set with more than one row", async () => {
    const request = { query: {} };
    const response = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await require("../app").default(request, response);

    expect(response.status).not.toHaveBeenCalledWith(404);
    expect(response.status).not.toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ uniqueNamesCount: 30 });
  });

  it("should handle a result set with only one row", async () => {
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

    await require("../app").default(request, response);

    expect(response.status).not.toHaveBeenCalledWith(404);
    expect(response.status).not.toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith(2 );
  });
})