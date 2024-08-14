// File: /pages/api/bookList.ts

import { prisma } from '@/data/values';
import { buildPrismaFilter } from '@/utils/buildPrismaFilter';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

    NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
