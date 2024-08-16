import { prisma } from '@/lib/prisma';
import { Book } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

type UniqueBookValue = {
  name?: string | null;
  author?: string | null;
  category?: string | null;
  genres?: string[];
};




export   async function POST(req: NextRequest) {

const { columnName } = await req.json();

console.log(req.method, req.body )

  if (!columnName || typeof columnName !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing columnName parameter' });
  }

  // Ensure columnName is a valid key of Book
  const validColumnNames: (keyof Book)[] = ['name', 'author', 'category', 'genres'];
  if (!validColumnNames.includes(columnName as keyof Book)) {
    console.log(2)
    return NextResponse.json({ error: 'Invalid column name' });
  }
  try {
    let uniqueValues: UniqueBookValue[] = [];
    uniqueValues = await prisma.knihy.findMany({
        select: { name: true },
        distinct: [columnName as 'name'| 'author'| 'category'| 'genres'],
      });

    // Safely access the columnName property
    const values = uniqueValues.filter(value => value !== null);

    return NextResponse.json(values);
  } catch (error) {
    console.error("Error retrieving values:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
