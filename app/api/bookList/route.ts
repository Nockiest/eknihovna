// import prisma from "@/lib/prisma";
import { buildPrismaFilter } from "@/utils/buildPrismaFilter";
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filters, page = 1, limit = 10 } = await req.json();

    if (!filters) {
      return NextResponse.json({ error: "Server didn't receive filters" }, { status: 400 });
    }

    if (page <= 0) {
      return NextResponse.json({ error: "Page number was set to 0 or less " }, { status: 400 });
    }

//     // Build the Prisma filter query
    const where = buildPrismaFilter(filters);
    console.log(filters,where)

//     // Fetch data using Prisma
    const books = await prisma.knihy.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      distinct: ['name'], // Select distinct on the 'name' field
    });
    // const books:Book[] = []
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    prisma.$disconnect()
  }
}

// export default function GET(
//   // req: NextApiRequest,
//   // res: NextApiResponse<ResponseData>
// ) {
//   res.status(200).json({ message: 'Hello from Next.js!' })
// }