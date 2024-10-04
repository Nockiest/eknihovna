import { bookHeaders, noCacheHeaders } from "@/data/values";
import { prisma } from "@/lib/prisma";
import { Book } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
const POST_BOOKS = async (req: NextRequest) => {
  try {
    const jsonData = await req.json();
    console.log(jsonData[0]);

    // Validate JSON format
    if (!jsonData || !Array.isArray(jsonData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Špatný formát, očekával jsem tabulku knížek.",
          headers: {
            ...noCacheHeaders,
          },
        },
        { status: 400 }
      );
    }

    // Validate keys against expected bookHeaders
    const keys = Object.keys(jsonData[0]) as Array<keyof Book>;
    const hasValidKeys = keys.every((key) => bookHeaders.indexOf(key as keyof Book) >= 0);

    if (!hasValidKeys) {
      return NextResponse.json(
        {
          success: false,
          error: `Tato Tabulka Má Špatné Názvy Hlaviček, očekávané názvy: ${bookHeaders.join(
            ", "
          )}`,
          message: `Tato Tabulka Má Špatné Názvy Hlaviček, obdržené názvy: ${keys.join(
            ", "
          )}, očekávané názvy: ${bookHeaders.join(", ")}`,
          headers: {
            ...noCacheHeaders,
          },
        },
        { status: 400 }
      );
    }

    // Process valid data
    const validData = jsonData
      .filter((item) => item.name) // Ensure important fields like name are not empty
      .map((item) => {
        return {
          id: item.id || uuidv4(), // Generate ID if not present
          name:
            typeof item.name === "string" || typeof item.name == "number"
              ? String(item.name).trim().substring(0, 255)
              : "",
          author:
            typeof item.author === "string"
              ? item.author.trim().substring(0, 255)
              : "",
          category:
            typeof item.category === "string"
              ? item.category.trim().substring(0, 50)
              : "",
          signatura:
            typeof item.signatura === "string"
              ? item.signatura.trim().substring(0, 50)
              : "",
          zpusob_ziskani:
            typeof item.zpusob_ziskani === "string"
              ? item.zpusob_ziskani.trim().substring(0, 100)
              : "",
          genres: Array.isArray(item.genres)
            ? item.genres
                .map((v: any) =>
                  typeof v === "string" ? v.trim().substring(0, 50) : ""
                )
                .filter(Boolean)
            : [],
          formaturita: Boolean(item.formaturita),
          available: Boolean(item.available),
          rating:
            item.rating !== null &&
            !isNaN(Number(item.rating)) &&
            item.rating >= 0
              ? Number(item.rating)
              : null,
        };
      });

    // Iterate over each valid book and upsert into the database
    for (const book of validData) {
      await prisma.knihy.upsert({
        where: { id: book.id }, // Check if a book with the same ID exists
        update: book,           // If it exists, update with new data
        create: book,           // If it doesn't exist, create a new entry
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data successfully inserted or updated!",
        headers: {
          ...noCacheHeaders,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting or updating data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Selhal jsem při nahrání dat: " + error,
        headers: {
          ...noCacheHeaders,
        },
      },
      { status: 500 }
    );
  }
};

export default POST_BOOKS;