import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/upload/route';
import XLSX from 'xlsx';
import { Readable } from 'stream';
import supertest from 'supertest';
import { MockContext, createMockContext, Context } from '@/__mocks__/@prisma/prismaContext';
import { testBook } from '@/data/values';
import { NextRequest } from 'next/server';

// Polyfill for `FormData` and `File` if necessary
global.FormData = require('formdata-polyfill');
global.File = require('file-polyfill');
let mockCtx: MockContext
let ctx: Context


// Mock the NextRequest and FormData
const createMockNextRequest = (buffer: Buffer): Partial<NextRequest> => {
  const formData = new FormData();
  const file = new File([buffer], 'test.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  formData.append('file', file);

  return {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'multipart/form-data',
    }),
    formData: async () => formData,
  } as Partial<NextRequest>;
};

describe('POST /api/upload', () => {
  it('should process an XLSX file and write to the mock Prisma DB', async () => {
    // Arrange
    const mockBooks = [
      { name: 'Book 1', author: 'Author 1' },
      { name: 'Book 2', author: 'Author 2' },
    ];
    debugger
    const worksheet = XLSX.utils.json_to_sheet(mockBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Books');
    const xlsxBuffer = XLSX.write(workbook, { type: 'buffer' });

    const mockReq = createMockNextRequest(xlsxBuffer);

    // Mock the Prisma call
    mockCtx.prisma.knihy.createMany.mockResolvedValue({ count: mockBooks.length });
    console.log(mockReq)
    // Act
    const response = await POST(mockReq as NextRequest);

    // Assert
    expect(  mockCtx.prisma.knihy.createMany).toHaveBeenCalledWith({
      data: mockBooks,
    });

    const jsonResponse = await response.json();
    expect(jsonResponse).toBeTruthy();
  });
});