import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all records from the 'knihy' table
    const data = await prisma.knihy.findMany();

    // Check if the data array is empty
    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in the table.' });
    }

    // Count the number of books
    const bookCount = data.length;

    // Convert Prisma query result to JSON and include the book count in the response
    const jsonData = {
      count: bookCount,
      books: data.map((item: any) => JSON.parse(JSON.stringify(item))),
    };

    // Return the count and the data
    return NextResponse.json(jsonData);

  } catch (error) {
    console.error('Error fetching data or creating response:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}