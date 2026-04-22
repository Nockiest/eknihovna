import { buildPrismaFilter } from "@/features/serverCode/buildPrismaFilter";
import { context, loadPrismaBookPage } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders, noCacheHeaders } from "@/data/values";
export const revalidate = 30;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  try {
    const { filters, page = 1, limit = 10 } = await req.json();
    console.log(filters, page);

    if (!filters) {
      return NextResponse.json(
        { error: "Server neobdržel filtry" },
        { status: 400 }
      );
    }

    if (page <= 0) {
      return NextResponse.json(
        { error: "Číslo stránky nastaveno na 0 nebo méně " },
        { status: 400 }
      );
    }

    const where = buildPrismaFilter(filters);
    const books = await loadPrismaBookPage(where, page, limit);

    return NextResponse.json(books, {
      headers: {
        ...noCacheHeaders,
        ...getCorsHeaders(req.headers.get("origin")),
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
