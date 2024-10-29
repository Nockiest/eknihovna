// import prisma from "@/lib/prisma";
import { buildPrismaFilter } from "@/features/serverCode/buildPrismaFilter";
import {
  context,
  findUniquePrismaBooks,
  loadPrismaBookPage,
} from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { noCacheHeaders } from "@/data/values";
export const revalidate = 30;
export async function POST(req: NextRequest) {
  try {
    const { filters, page = 1, limit = 10    } = await req.json();
    console.log(filters, page,  );


    if (!filters) {
      return NextResponse.json(
        { error: "Server didn't receive filters" },
        { status: 400 }
      );
    }

    if (page <= 0) {
      return NextResponse.json(
        { error: "Page number was set to 0 or less " },
        { status: 400 }
      );
    }

    //     // Build the Prisma filter query
    const where = buildPrismaFilter(filters);

    //     // Fetch data using Prisma
    const books = await loadPrismaBookPage(where, page, limit);

    return NextResponse.json(books, {
      headers: {
        ...noCacheHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    context.prisma.$disconnect();
  }
}


    // if (id) {
    //   try {
    //     const book = await findUniquePrismaBooks(id); // await prisma.knihy.findUnique({

    //     if (!book) {
    //       return NextResponse.json(
    //         { error: "book not found " },
    //         { status: 400 }
    //       );
    //     }

    //     return NextResponse.json([book], {
    //       headers: {
    //         ...noCacheHeaders,
    //       },
    //     });
    //   } catch (error) {
    //     console.error("Error fetching book by ID:", error);
    //     return NextResponse.json(
    //       { error: "Internal Server Error" },
    //       { status: 500 }
    //     );
    //   }
    // }
