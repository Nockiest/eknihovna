// Import necessary modules and libraries
import { NextRequest, NextResponse } from "next/server";
import { noCacheHeaders } from "@/data/values";
import { findUniquePrismaBooks, context } from "@/lib/prisma";

export const revalidate = 30;

// GET request to fetch a single book by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      );
    }

    // Fetch the specific book by ID using Prisma
    const book = await findUniquePrismaBooks(id);

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // Return the book data as a JSON response
    return NextResponse.json(book, {
      headers: {
        ...noCacheHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    context.prisma.$disconnect();
  }
}
