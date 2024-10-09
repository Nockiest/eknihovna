// // test it deletes all books from db
// import DELETE_BOOKS from "../../app/api/upload/DELETE"
// import { createMocks } from 'node-mocks-http';

// // Mock prisma client
// import { NextRequest, NextResponse } from 'next/server'; // Import NextRequest for mocking
// import { ReadableStream } from 'web-streams-polyfill/ponyfill/es2018'; // Needed for body streaming

// // Mock prisma client
// jest.mock('@prisma/client', () => {
//   const prisma = {
//     knihy: {
//       deleteMany: jest.fn(),
//       delete: jest.fn(),
//     },
//     $disconnect: jest.fn(),
//   };
//   return { PrismaClient: jest.fn(() => prisma) };
// });

// describe('DELETE_BOOKS API', () => {
//   let prisma;

//   beforeEach(() => {
//     // Re-import prisma after mock
//     prisma = require('@prisma/client').PrismaClient();
//   });

//   afterEach(() => {
//     jest.clearAllMocks(); // Clean up after each test
//   });

//   // Helper function to create a mock NextRequest with JSON body
//   function createMockNextRequest(body) {
//     const stream = new ReadableStream({
//       start(controller) {
//         controller.enqueue(new TextEncoder().encode(JSON.stringify(body)));
//         controller.close();
//       },
//     });
//     return new NextRequest('http://localhost/api/upload', {
//       method: 'DELETE',
//       body: stream,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }

//   test('Deletes all books when ID is -1', async () => {
//     prisma.knihy.deleteMany.mockResolvedValueOnce({ count: 10 });

//     const req = createMockNextRequest({ id: '-1' }); // Simulate a DELETE request with ID -1

//     const response = await DELETE_BOOKS(req); // Call the API route

//     expect(prisma.knihy.deleteMany).toHaveBeenCalled();
//     expect(response.status).toBe(200);
//     expect(await response.json()).toEqual({
//       success: true,
//       message: 'smazáno  10 knih',
//     });
//   });

//   test('Deletes specific book when ID is provided', async () => {
//     prisma.knihy.delete.mockResolvedValueOnce({ id: '1', name: 'Test Book' });

//     const req = createMockNextRequest({ id: '1' }); // Simulate a DELETE request with ID '1'

//     const response = await DELETE_BOOKS(req);

//     expect(prisma.knihy.delete).toHaveBeenCalledWith({ where: { id: '1' } });
//     expect(response.status).toBe(200);
//     expect(await response.json()).toEqual({
//       success: true,
//       message: "Kniha 'Test Book' byla úspěšně smazána",
//     });
//   });

//   test('Returns 404 if book does not exist', async () => {
//     prisma.knihy.delete.mockResolvedValueOnce(null);

//     const req = createMockNextRequest({ id: 'non-existing-id' });

//     const response = await DELETE_BOOKS(req);

//     expect(prisma.knihy.delete).toHaveBeenCalledWith({ where: { id: 'non-existing-id' } });
//     expect(response.status).toBe(404);
//     expect(await response.json()).toEqual({
//       success: false,
//       error: 'Kniha s id: non-existing-id v databázi neexistuje',
//     });
//   });

//   test('Returns 400 when no ID is provided', async () => {
//     const req = createMockNextRequest({}); // Empty body

//     const response = await DELETE_BOOKS(req);

//     expect(response.status).toBe(400);
//     expect(await response.json()).toEqual({
//       success: false,
//       error: 'ID neposkytnuto',
//     });
//   });

//   test('Handles server error', async () => {
//     prisma.knihy.deleteMany.mockRejectedValueOnce(new Error('Server error'));

//     const req = createMockNextRequest({ id: '-1' });

//     const response = await DELETE_BOOKS(req);

//     expect(response.status).toBe(500);
//     expect(await response.json()).toEqual({
//       success: false,
//       error: 'Server error',
//       details: 'Server error',
//     });
//   });
// });