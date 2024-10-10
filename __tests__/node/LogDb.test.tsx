import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { GET } from "../../app/api/logDb/route";
import { createMocks } from "node-mocks-http";
import { context, countPrismaBooks } from "@/lib/prisma";

export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx;
  (global as any).context = mockCtx;
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: () => Promise.resolve(data), // Return a promise that resolves to `data`
      headers: new Map([
        [
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        ],
      ]),
    })),
  },
}));
jest.mock('@/lib/prisma', () => ({
  countPrismaBooks: jest.fn(),  // Create a mock function for countPrismaBooks
}));

describe("LogDB API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to avoid conflicts
  });

  // Successfully retrieves book count from the database
  it("should return the correct book count when the database query is successful", async () => {
    const mockBookCount = 42;
    // jest.mock("@/lib/prisma", () => ({
    //   countPrismaBooks: jest.fn().mockResolvedValue(mockBookCount),
    // }));
    (countPrismaBooks as jest.Mock).mockResolvedValue(mockBookCount);
    const { req, res } = createMocks({
      method: "GET",
    });

    const response = await GET();
    const jsonResponse = await response.json();
    expect(jsonResponse.count).toBe(mockBookCount);
    expect(response.headers.get("Cache-Control")).toBe(
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
  });

  // Database connection failure
  it('should return an error message when there is a database connection failure', async () => {
    // Mock countPrismaBooks to throw an error
    (countPrismaBooks as jest.Mock).mockRejectedValue(new Error('Database connection error'));

    const response = await GET();
    const jsonResponse = await response.json();

    // Validate error handling
    expect(jsonResponse.error).toBe('Problém na straně serveru');
  });
});
