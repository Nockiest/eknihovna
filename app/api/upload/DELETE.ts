import { context, deleteAllPrismaBooks, deletePrismaBook } from "@/lib/prisma";
import { Book } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

 const  DELETE_BOOKS =async (req:NextRequest) => {
    try {
        // Extract the ID from the request body
        let { id } = await req.json();

        // Ověříme, zda je id platné a přetypujeme na string
        if (id !== undefined && id !== null) {
          id = String(id).trim(); // Převod na string a ořezání prázdných znaků
        } else {
          return NextResponse.json(
            { success: false, error: "ID neposkytnuto" },
            { status: 400 }
          );
        }
        console.log(id, parseInt(id) == -1);
        console.log(typeof id === "string");
        if (parseInt(id) == -1) {
          console.log("x");

           const deleteResult =  await deleteAllPrismaBooks() // await prisma.knihy.deleteMany();
          console.log("returning");
          return NextResponse.json(
            {
              success: true,
              message: `smazáno  ${deleteResult.count} knih`,
            },
            { status: 200 }
          );
        } else if (id && typeof id === "string") {
          // Check if a book with the provided ID exists
          console.log("deleting", id);
          const book:Book = await deletePrismaBook(id) as Book;
          // await prisma.knihy.delete({
          //   where: { id },
          // });
          console.log("deleted", book);
          if (!book) {
            return NextResponse.json(
              {
                success: false,
                error: `Kniha s id: ${id} v databázi neexistuje`,
              },
              { status: 404 }
            );
          }
          return NextResponse.json(
            { success: true, message: `Kniha '${book.name}' byla úspěšně smazána` },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            {
              success: false,
              error: "ID neposkytnuto",
            },
            { status: 400 }
          );
        }
      } catch (error: any) {
        console.error("Error deleting book:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Server error",
            details: error.message,
          },
          { status: 500 }
        );
      } finally {
        await context.prisma.$disconnect();
      }
}

export default DELETE_BOOKS