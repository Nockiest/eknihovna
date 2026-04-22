// app/api/bookList/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders, noCacheHeaders } from "@/data/values";
import { findUniquePrismaBooks, context } from "@/lib/prisma";
import { errorResponse } from "@/features/serverCode/errorResponse";

export const revalidate = 30;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split("/").pop();

  if (!id) {
    return errorResponse("Book ID is required", 400);
  }

  try {
    const book = await findUniquePrismaBooks(id);

    if (!book) {
      return errorResponse("Book not found", 404);
    }

    return NextResponse.json(book, {
      headers: {
        ...noCacheHeaders,
        ...getCorsHeaders(req.headers.get("origin")),
      },
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    return errorResponse("Internal Server Error", 500);
  } finally {
    await context.prisma.$disconnect();
  }
}
