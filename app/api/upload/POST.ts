import { bookHeaders, noCacheHeaders, truthyValues } from "@/data/values";
import {
  countPrismaBooks,
  craeteManyPrismaBooks,
  deleteAllPrismaBooks,
  upsertPrismaBook,
} from "@/lib/prisma";
import { Book } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds
const POST_BOOKS = async (json: any) => {
  try {
    const { removePreviousData, books } = json;
    console.log(books[0]);
    console.log(removePreviousData);

    // Validate JSON format
    if (!books || !Array.isArray(books)) {
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
    const FirstBookKeys = Object.keys(books[0]) as Array<keyof Book>;
    const hasValidKeys = FirstBookKeys.every(
      (key) => bookHeaders.indexOf(key as keyof Book) >= 0
    );

    if (!hasValidKeys) {
      return NextResponse.json(
        {
          success: false,
          error: `Tato Tabulka Má Špatné Názvy Hlaviček, očekávané názvy: ${bookHeaders.join(
            ", "
          )}`,
          message: `Tato Tabulka Má Špatné Názvy Hlaviček, obdržené názvy: ${FirstBookKeys.join(
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
    const validData = books
      .filter((item) => item.name) // Ensure important fields like name are not empty
      .map((item) => {
        console.log(
          item.category? item.category
                  .trim()
                  .substring(0, 50)
                  .toLowerCase()
                  .replace(/^\w/, (c: string) => c.toUpperCase()): ''
        )
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
              ? item.category
                  .trim()
                  .substring(0, 50)
                  .toLowerCase()
                  .replace(/^\w/, (c: string) => c.toUpperCase())
              : "",
          signatura:
            typeof item.signatura === "string"
              ? item.signatura
                  .trim()
                  .substring(0, 50)
                  .toLowerCase()
                  .replace(/^\w/, (c: string) => c.toUpperCase())
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
          formaturita:
            truthyValues.indexOf(item.formaturita) >= 0 ? true : false,
          available: truthyValues.indexOf(item.available) >= 0 ? true : false,
          rating:
            item.rating !== null &&
            !isNaN(Number(item.rating)) &&
            item.rating >= 0
              ? Number(item.rating)
              : null,
        };
      });
    if (removePreviousData) {
      // Delete all previous books
      deleteAllPrismaBooks()
      console.log("Delete all books");
      craeteManyPrismaBooks(validData as Book[]);
    } else {
      for (const book of validData) {
        console.log(validData.indexOf(book));
        await upsertPrismaBook(book as Book);
      }
    }

    console.log(
      validData[0],
      books[0],
      truthyValues.indexOf(books[0].formaturita),
      truthyValues.indexOf(books[0].available)
    );
    const totalBooks = countPrismaBooks(); //await context.prisma.knihy.count();

    return NextResponse.json(
      {
        success: true,
        message: `Data successfully inserted or updated! Current number of books: ${totalBooks}`,
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
