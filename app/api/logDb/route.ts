import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const bookCount =await  prisma.knihy.count()
    console.log('počet knih:', bookCount);
    // Convert Prisma query result to JSON and include the book count in the response
    const jsonData = {
      count: bookCount,
    };

    // Return the count and the data
    return NextResponse.json(jsonData);

  } catch (error) {
    console.error('Error fetching data or creating response:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}