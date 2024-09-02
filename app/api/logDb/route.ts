import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export const revalidate = 0
export async function GET() {
  try {
    console.log('get book count?' );
    const bookCount =await  prisma.knihy.count()
    console.log('počet knih:', bookCount);
    // Convert Prisma query result to JSON and include the book count in the response
    const jsonData = {
      count: bookCount,
    };

    // Return the count and the data
    return NextResponse.json(jsonData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error fetching data or creating response:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}