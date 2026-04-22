import { context, deleteAllPrismaBooks, deletePrismaBook } from "@/lib/prisma";
import { Book } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "@/data/values";

const DELETE_BOOKS = async (req: NextRequest) => {
  const cors = getCorsHeaders(req.headers.get("origin"));
  try {
    let { id } = await req.json();

    if (id !== undefined && id !== null) {
      id = String(id).trim();
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
      const deleteResult = await deleteAllPrismaBooks();
      console.log("returning");
      return NextResponse.json(
        { success: true, message: `smazáno  ${deleteResult.count} knih` },
        { status: 200, headers: cors }
      );
    } else if (id && typeof id === "string") {
      console.log("deleting", id);
      const book: Book = await deletePrismaBook(id) as Book;
      console.log("deleted", book);
      if (!book) {
        return NextResponse.json(
          { success: false, error: `Kniha s id: ${id} v databázi neexistuje` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, message: `Kniha '${book.name}' byla úspěšně smazána` },
        { status: 200, headers: cors }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "ID neposkytnuto" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { success: false, error: "Server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await context.prisma.$disconnect();
  }
};

export default DELETE_BOOKS;
