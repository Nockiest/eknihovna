import { falsyValues } from "@/data/values";
import { prisma } from "@/lib/prisma";
import { Book } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

type UniqueBookValue = {
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
    ![ "name"  || "author"||  "category" || "genres"].indexOf(columnName) ||
    !(columnName in prisma.knihy.fields)
  ) {
    return NextResponse.json({
      error:
        "Invalid or missing columnName parameter. It must be a valid property of Book.",
    });
  }

  try {
    // Dynamically construct the select object
    const selectObject: Record<string, boolean> = {};
    selectObject[columnName] = true;

    // Query the database for distinct values
    const uniqueValues: UniqueBookValue[] = await prisma.knihy.findMany({
      select: selectObject,
      distinct: [columnName as keyof UniqueBookValue],
    });

    console.log(columnName, uniqueValues);

    // Safely access the columnName property and filter for truthy values
    const values = uniqueValues
      .map(
        (item) => item[columnName as "name" | "author" | "category" | "genres"]
      )
      .filter(item => {
        // Handle cases where item is an array
        if (Array.isArray(item)) {
          return item.length > 0; // Example: Filter out empty arrays
        }
        if (item === null || item === undefined) {
          return false
        }
        // Handle non-array cases
        return !falsyValues.includes(item);
      }); // Filters out falsy values (null, undefined, 0, false, "")

    return NextResponse.json(values);
  } catch (error) {
    console.error("Error retrieving values:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
