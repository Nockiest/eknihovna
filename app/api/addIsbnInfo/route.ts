 
import { defaultFilters } from "@/data/values";
import { buildPrismaFilter } from "@/features/serverCode/buildPrismaFilter";
import { context } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
 
export async function POST(req: NextRequest) {
//     try {
//       // Parse the request body to get filters if needed
//       const { filters } = await req.json();
//       const where = buildPrismaFilter(filters?filters:defaultFilters);
//       // Retrieve all books with ISBN from the database
//       const books = await context.prisma.knihy.findMany({
//         where: where,
//         select: {
//           isbn: true,
//         },
//       });

//       // Iterate over each book
//       for (const book of books) {
//         // Check if there is already an entry with the same ISBN
//         const existingEntry = await context.prisma.isbn.findUnique({
//           where: { isbn: book.isbn as string }, // Ensure book.isbn is treated as a string
//         });

//         // If no existing entry, store the ISBN data
//         if (!existingEntry && book.isbn) {
//           await storeIsbnBookData(book.isbn);
//           // Wait 100 milliseconds to avoid hitting API too quickly
//           await new Promise((resolve) => setTimeout(resolve, 100));
//         }
//       }


//       // Return the books as a JSON response with no-cache headers
//       return NextResponse.json(books, {
//         headers: {
//           ...noCacheHeaders,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching books:", error);
//       return NextResponse.json(
//         { error: "Internal Server Error" },
//         { status: 500 }
//       );
//     } finally {
//       // Disconnect the Prisma client
//       context.prisma.$disconnect();
//     }
  }