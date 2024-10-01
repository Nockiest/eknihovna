import { POST } from '../app/api/upload/route'; // Replace with the correct path to the API route
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {prisma} from '../lib/prisma'; // Make sure to import your prisma instance
import { v4 as uuidv4 } from 'uuid';

// Mock prisma and uuidv4
jest.mock('../lib/prisma');
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid'),
}));
// const mockNext: NextFunction = jest.fn();
describe('POST API route tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return 400 if data is not an array', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ name: 'Invalid object' }),
    };

    const response = await POST(req as any);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        error: 'Invalid data format. Expected an array of books.',
        headers: expect.any(Object),
      },
      { status: 400 }
    );
    expect(response.status).toBe(400);
  });
  it('should insert valid data and return success', async () => {
    const validData = [
      {
        id: null,
        name: 'Book Title',
        author: 'Author Name',
        category: 'Fiction',
        genres: ['Fantasy'],
        signatura: 'SIG001',
        zpusob_ziskani: 'Purchase',
        formaturita: true,
        available: true,
        rating: 5,
      },
    ];

    const req = new NextRequest(JSON.stringify(validData), {
      method: 'POST',
    });

    prisma.knihy.createMany.mockResolvedValueOnce({ count: 1 });

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(200);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toBe('Data inserted successfully!');
    expect(prisma.knihy.createMany).toHaveBeenCalledWith({
      data: [
        {
          id: 'mocked-uuid',
          name: 'Book Title',
          author: 'Author Name',
          category: 'Fiction',
          genres: ['Fantasy'],
          signatura: 'SIG001',
          zpusob_ziskani: 'Purchase',
          formaturita: true,
          available: true,
          rating: 5,
        },
      ],
    });
  });

  it('should return 500 on database error', async () => {
    const validData = [
      {
        id: '123',
        name: 'Book Title',
        author: 'Author Name',
      },
    ];

    const req = new NextRequest(JSON.stringify(validData), {
      method: 'POST',
    });

    prisma.knihy.createMany.mockRejectedValueOnce(new Error('Database Error'));

    const response = await POST(req);
    const jsonResponse = await response.json();

    expect(response.status).toBe(500);
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe('Failed to insert data');
    expect(prisma.knihy.createMany).toHaveBeenCalled();
  });
});
