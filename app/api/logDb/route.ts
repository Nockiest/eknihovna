import { getCorsHeaders, noCacheHeaders } from "@/data/values";
import { countPrismaBooks } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 0;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  try {
    const bookCount = await countPrismaBooks();
    console.log("počet knih:", bookCount);

    return NextResponse.json(
      { count: bookCount },
      {
        headers: {
          ...noCacheHeaders,
          ...getCorsHeaders(req.headers.get("origin")),
        },
      }
    );
  } catch (error) {
    console.error("Error fetching data or creating response:", error);
    return NextResponse.json({ error: "Server má momentálně problém získat data" });
  }
}
