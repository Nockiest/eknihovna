import { prisma } from '@/data/values';
import { Book } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type UniqueBookValue = {
  name?: string | null;
  author?: string | null;
  category?: string | null;
  genres?: string[];
};

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { columnName } = req.query;

  if (!columnName || typeof columnName !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing columnName parameter' });
  }

  // Ensure columnName is a valid key of Book
  const validColumnNames: (keyof Book)[] = ['name', 'author', 'category', 'genres'];
  if (!validColumnNames.includes(columnName as keyof Book)) {
    return res.status(400).json({ error: 'Invalid column name' });
  }

  try {
    let uniqueValues: UniqueBookValue[] = [];

    switch (columnName) {
      case 'name':
        uniqueValues = await prisma.knihy.findMany({
          select: { name: true },
          distinct: ['name'],
        });
        break;
      case 'author':
        uniqueValues = await prisma.knihy.findMany({
          select: { author: true },
          distinct: ['author'],
        });
        break;
      case 'category':
        uniqueValues = await prisma.knihy.findMany({
          select: { category: true },
          distinct: ['category'],
        });
        break;
      case 'genres':
        uniqueValues = await prisma.knihy.findMany({
          select: { genres: true },
          distinct: ['genres'],
        });
        break;
    }

    // Safely access the columnName property
    const values = uniqueValues.map(item => {
      if (columnName === 'name') return item.name;
      if (columnName === 'author') return item.author;
      if (columnName === 'category') return item.category;
      if (columnName === 'genres') return item.genres;
      return null; // Fallback
    });

    NextResponse.json(values);
  } catch (error) {
    console.error("Error retrieving values:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
