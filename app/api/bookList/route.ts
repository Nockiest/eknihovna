// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/app/lib/prisma';
// import { buildPrismaFilter } from '@/utils/buildPrismaFilter';

// export async function POST(req: NextRequest) {
//   try {
//     const { filters, page = 1, limit = 10 } = await req.json();

//     if (!filters) {
//       return NextResponse.json({ error: "Server didn't receive filters" }, { status: 400 });
//     }

//     if (page <= 0) {
//       return NextResponse.json({ error: "Page number was set to 0 or less" }, { status: 400 });
//     }

//     // Build the Prisma filter query
//     const where = buildPrismaFilter(filters);

//     // Fetch data using Prisma
//     const books = await prisma.knihy.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       distinct: ['name'], // Select distinct on the 'name' field
//     });
//     return NextResponse.json(books);
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
