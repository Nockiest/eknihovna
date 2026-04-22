import { getCorsHeaders, noCacheHeaders } from "@/data/values";
import { findManyPrismaUniquePrismaBooksColumn } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 120;
export type UniqueBookValue = {
  name?: string | null;
  author?: string | null;
  category?: string | null;
  genres?: string[];
};

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  const { columnName } = await req.json();

  if (
    !columnName ||
    typeof columnName !== "string" ||
    ["name", "author", "category", "genres"].indexOf(columnName) === -1
  ) {
    return NextResponse.json({
      error: `${columnName} Tato hodnota, kterou chcete filtrovat, není validní pro získání knihy`,
    });
  }

  try {
    const selectObject: Record<string, boolean> = {};
    selectObject[columnName] = true;

    const uniqueValues: UniqueBookValue[] = await findManyPrismaUniquePrismaBooksColumn(selectObject, columnName);

    const values = uniqueValues
      .map((item) => item[columnName as keyof UniqueBookValue])
      .filter((item) => {
        if (Array.isArray(item)) {
          return item.length > 0;
        }
        if (typeof item === "string" && item.trim() !== "") {
          return true;
        }
        return false;
      });

    return NextResponse.json(values, {
      headers: {
        ...noCacheHeaders,
        ...getCorsHeaders(req.headers.get("origin")),
      },
    });
  } catch (error) {
    console.error("Error retrieving values:", error);
    return NextResponse.json({ error: "Problém na straně serveru" });
  }
}
