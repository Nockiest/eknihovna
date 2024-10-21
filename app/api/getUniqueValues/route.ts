import { falsyValues, noCacheHeaders } from "@/data/values";
import { context, findManyPrismaUniquePrismaBooksColumn } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export const revalidate = 120;
export type UniqueBookValue = {
  name?: string | null;
  author?: string | null;
  category?: string | null;
  genres?: string[];
};

export async function POST(req: NextRequest) {
  const { columnName } = await req.json();

  // Validate that columnName is a valid string and a key of the Book type
  if (
    !columnName ||
    typeof columnName !== "string" ||
    ["name", "author", "category", "genres"].indexOf(columnName) === -1
  ) {
    return NextResponse.json({
      error: `${columnName} Tato hodnota není validní pro získání knihy`,
    });
  }

  try {
    // Dynamically construct the select object
    const selectObject: Record<string, boolean> = {};
    selectObject[columnName] = true;

    // Query the database for distinct values
    const uniqueValues: UniqueBookValue[] = await findManyPrismaUniquePrismaBooksColumn(selectObject, columnName);

    // Safely access the columnName property and filter for non-empty string values
    const values = uniqueValues
      .map((item) => item[columnName as keyof UniqueBookValue])
      .filter((item) => {
        // Handle cases where item is an array
        if (Array.isArray(item)) {
          return item.length > 0; // Example: Filter out empty arrays
        }
        if (typeof item === "string" && item.trim() !== "") {
          return true;
        }
        return false;
      });

    return NextResponse.json(
      values,
      {
        headers: {
          ...noCacheHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error retrieving values:", error);
    return NextResponse.json({ error: "Problém na straně serveru" });
  }
}
