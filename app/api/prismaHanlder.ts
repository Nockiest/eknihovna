import {prisma} from "@/lib/prisma"
import { Book } from "@/types/types"

export async function createBook(book:Book) {
      return await prisma.knihy.create({
        data: book,
      })

  }