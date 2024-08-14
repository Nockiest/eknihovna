import { prisma } from '@/data/values';
import { Book } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
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
    console.log(1)
    return NextResponse.json({ error: 'Invalid or missing columnName parameter' });
  }

  // Ensure columnName is a valid key of Book
  const validColumnNames: (keyof Book)[] = ['name', 'author', 'category', 'genres'];
  if (!validColumnNames.includes(columnName as keyof Book)) {
    console.log(2)
    return NextResponse.json({ error: 'Invalid column name' });
  }
console.log(3, columnName);
  try {
    let uniqueValues: UniqueBookValue[] = [];
    uniqueValues = await prisma.knihy.findMany({
        select: { name: true },
        distinct: [columnName as 'name'| 'author'| 'category'| 'genres'],
      });
    // switch (columnName) {
    //   case 'name':
    //     uniqueValues = await prisma.knihy.findMany({
    //       select: { name: true },
    //       distinct: ['name'],
    //     });
    //     break;
    //   case 'author':
    //     uniqueValues = await prisma.knihy.findMany({
    //       select: { author: true },
    //       distinct: ['author'],
    //     });
    //     break;
    //   case 'category':
    //     uniqueValues = await prisma.knihy.findMany({
    //       select: { category: true },
    //       distinct: ['category'],
    //     });
    //     break;
    //   case 'genres':
    //     uniqueValues = await prisma.knihy.findMany({
    //       select: { genres: true },
    //       distinct: ['genres'],
    //     });
    //     break;
    // }

    // Safely access the columnName property
    const values = uniqueValues.map(item => {
      if (columnName === 'name') return item.name;
      if (columnName === 'author') return item.author;
      if (columnName === 'category') return item.category;
      if (columnName === 'genres') return item.genres;
      return null; // Fallback
    }).filter(value => value !== null);

    return NextResponse.json(values);
  } catch (error) {
    console.error("Error retrieving values:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
