// import prisma from "@/lib/prisma";
import { buildPrismaFilter } from "@/utils/buildPrismaFilter";
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";
import { noCacheHeaders } from "@/data/values";
export const revalidate = 0
export async function POST(req: NextRequest) {
  try {
    const { filters, page = 1, limit = 10 ,id} = await req.json();
    console.log(filters,page,id)

    if (id  ) {
      try {
        const book = await prisma.knihy.findUnique({
          where: {  id  },
        });

        if (!book) {
          return NextResponse.json({ error: "book not found " }, { status: 400 });
        }

        return  NextResponse.json([book],{
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
          }
        },);
      } catch (error) {
        console.error('Error fetching book by ID:', error);
        return  NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }

    if (!filters) {
      return NextResponse.json({ error: "Server didn't receive filters" }, { status: 400 });
    }

    if (page <= 0) {
      return NextResponse.json({ error: "Page number was set to 0 or less " }, { status: 400 });
    }

//     // Build the Prisma filter query
    const where = buildPrismaFilter(filters);

//     // Fetch data using Prisma
    const books = await prisma.knihy.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      distinct: ['name'], // Select distinct on the 'name' field
    });
    // const books:Book[] = []
    return NextResponse.json(books, {
      headers: {
        ...noCacheHeaders
      }
    });

  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    prisma.$disconnect()
  }
}
