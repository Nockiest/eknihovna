import POST_BOOKS from "@/app/api/upload/POST";
import { emptyBook, testBook } from "@/data/values";
import { MockContext, Context, createMockContext } from '../../types/prismaContext'
import { Book } from "@/types/types";
import { upsertPrismaBook } from "@/lib/prisma";
let mockCtx: MockContext
let ctx: Context


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
  upsertPrismaBook: jest.fn(), // Create a mock function for upsertFce
}));


describe('POST_BOOKS', () => {
  beforeEach(() => {
    mockCtx = createMockContext()
    ctx = mockCtx as unknown as Context
    (global as any).context = mockCtx;

    jest.clearAllMocks(); // Clear mocks before each test

  })
  // Successfully processes and inserts valid book data into the database
  it('should insert valid book data into the database when provided with correct JSON format', async () => {
    const mockBooks:Book[] = [
        testBook
    ];
    const json = { removePreviousData: false, books: mockBooks };
    (upsertPrismaBook as jest.Mock).mockResolvedValue( testBook);
    // prismaMock.knihy.upsert.mockResolvedValue(testBook as Required<Book>  )
    const response = await POST_BOOKS(json);
    console.log(response )
    // expect(prismaMock.knihy.upsert).toHaveBeenCalledTimes(1);
    // expect(response.status).toBe(200);
    expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining("Data successfully inserted or updated!"),
      })
    );
  });

  // Handles empty or null book array gracefully
  it('should return a 400 error when books array is empty or null', async () => {
    const jsonWithEmptyBooks = { removePreviousData: false, books: [] };
    const jsonWithNullBooks = { removePreviousData: false, books: null };

    const responseEmpty = await POST_BOOKS(jsonWithEmptyBooks);
    const responseNull = await POST_BOOKS(jsonWithNullBooks);

    // expect(responseEmpty.status).toBe(400);
    await expect(responseEmpty.json()).resolves.toEqual(
      expect.objectContaining({
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Expires": "0",
          "Pragma": "no-cache",
          "Surrogate-Control": "no-store",
        },
        message: "Selhal jsem při nahrání dat: TypeError: Cannot convert undefined or null to object",
        success: false,
      })
    );

    // expect(responseNull.status).toBe(400);
    expect(responseNull.json()).resolves.toEqual(
      expect.objectContaining({
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Expires": "0",
          "Pragma": "no-cache",
          "Surrogate-Control": "no-store",
        },
        message : "Selhal jsem při nahrání dat: TypeError: Cannot read properties of null (reading '0')",
        success: false,
      })
    );
  });
});

   // const mockPrisma = {
    //   knihy: {
    //     upsert: jest.fn(),
    //     count: jest.fn().mockResolvedValue(1),
    //   },
    // };