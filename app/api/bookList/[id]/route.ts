// app/api/bookList/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { noCacheHeaders } from "@/data/values";
import { findUniquePrismaBooks, context } from "@/features/serverCode/prisma/prisma";
import { errorResponse } from "@/features/serverCode/errorResponse";

export const revalidate = 30;

// GET request to fetch a single book by ID
export async function GET(req: NextRequest) {
  // Extract the book ID from the URL
  const { pathname } = req.nextUrl; // Get the pathname from the request URL
  const id = pathname.split("/").pop(); // Extract the ID from the URL

  // Validate ID parameter
  if (!id) {
    return errorResponse("Book ID is required", 400);
  }

  try {
    // Fetch the specific book by ID using Prisma
    const book = await findUniquePrismaBooks(id);

    if (!book) {
      return errorResponse("Book not found", 404);
    }

    // Return the book data as a JSON response
    return NextResponse.json(book, {
      headers: {
        ...noCacheHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    return errorResponse("Internal Server Error", 500);
  } finally {
    await context.prisma.$disconnect(); // Ensure disconnection happens properly
  }
}
