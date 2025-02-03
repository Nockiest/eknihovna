import { UploadContext } from "@/app/upload/context";
import sanitizeBook from "@/components/SanitizeBook";
import {
  bookHeaders,
  corsHeaders,
  noCacheHeaders,
  truthyValues,
} from "@/data/values";
import {
  countPrismaBooks,
  craeteManyPrismaBooks,
  deleteAllPrismaBooks,
  upsertPrismaBook,
} from "@/lib/prisma";
import { Book } from "@/types/types";
import { NextResponse } from "next/server";
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
          message: "Špatný formát, očekával jsem tabulku knížek.",
          error: "Špatný formát, očekával jsem tabulku knížek.",
          headers: {
            ...noCacheHeaders,
            ...corsHeaders,
          },
        },
        { status: 400 }
      );
    }

    // Validate keys against expected bookHeaders
    const FirstBookKeys = Object.keys(books[0]) as Array<keyof Book>;
    const invalidKeys = FirstBookKeys.filter(
      (key) => bookHeaders.indexOf(key as keyof Book) < 0
    );
    console.log("Invalid Keys:", invalidKeys);
    const hasValidKeys = invalidKeys.length === 0;
    console.log("has valid keys?", hasValidKeys, invalidKeys);
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
    const rejectedRows: string[] = [];
    let uploadedBooks = [];

    // Process valid data
    const validData = books.map(sanitizeBook);
    console.log(validData)
    if (removePreviousData) {
      // Delete all previous books
      await deleteAllPrismaBooks();
      console.log("Delete all books");
      await craeteManyPrismaBooks(validData as Book[]);
    } else {
      for (const book of validData) {
        console.log(validData.indexOf(book));
        const upsertedBook = await upsertPrismaBook(book as Book);
        uploadedBooks.push(upsertedBook);
      }
    }

    console.log(
      "první validní kniha" + validData[0],
      "první přijatá kniha" + books[0],
      "formaturita truthy?" + truthyValues.indexOf(books[0].formaturita),
      "available truthy?" + truthyValues.indexOf(books[0].available),
    );
    if (validData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "ani jedna kniha poslaná na server nebyla přijata. zkontrolujte, jestli měly knihy správně vyplněné hodnoty",
          error:
            "ani jedna kniha poslaná na server nebyla přijata. zkontrolujte, jestli měly knihy správně vyplněné hodnoty",
          headers: {
            ...noCacheHeaders,
          },
        },
        { status: 400 }
      );
    }
    const totalBooks = await countPrismaBooks();

    return NextResponse.json(
      {
        success: true,
        message: `Data úspěšně nahrána, počet knih: ${totalBooks}.
        ${
          rejectedRows.length > 0
            ? "Tyto knihy se bohužel nepodařilo nahrát" +
              rejectedRows.join(", ")
            : ""
        }, ${
          uploadedBooks.length > 0
            ? `název první nahrané knihy ${JSON.stringify(
                uploadedBooks[0].name
              )}`
            : ""
        } `.replace(/\n/g, ""),
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
        message: "Selhal jsem při nahrání dat, popis erroru: " + error,
        error: "Selhal jsem při nahrání dat, popis erroru: " + error,
        headers: {
          ...noCacheHeaders,
        },
      },
      { status: 500 }
    );
  }
};

export default POST_BOOKS;



// Usage example
