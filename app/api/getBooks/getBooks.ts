// File: /pages/api/bookList.ts

import { prisma } from '@/lib/prisma';
import { buildPrismaFilter } from '@/utils/buildPrismaFilter';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export   async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { filters, page = 1, limit = 10 } = req.body;

  if (!filters) {
    return res.status(400).json({ error: "Server didn't receive filters" });
  }

  if (page <= 0) {
    return res.status(400).json({ error: "Page number was set to 0 or less" });
  }

  try {
    // Build the Prisma filter query
    const where = buildPrismaFilter(filters);
    // Fetch data using Prisma
    const books = await prisma.knihy.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      distinct: ['name'], // Select distinct on the 'name' field
    });
    console.log(books.length)
    return NextResponse.json(books, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
