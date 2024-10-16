import { UniqueBookValue } from "@/app/api/getUniqueValues/route";
import { Context } from "@/types/prismaContext";
import { Book } from "@/types/types";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = null // global as unknown as { prisma: PrismaClient };

export const context: Context = globalForPrisma || {
  prisma: new PrismaClient(),
  // log: ['query'],
};

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = context.prisma;
// }

// add prisma functions wiht ctx here?

export const upsertPrismaBook = async (book: Book, ctx: Context = context) => {
  const res = await ctx.prisma.knihy.upsert({
    where: { id: book.id },
    update: book,
    create: book,
  });
  return res;
};

export const deleteAllPrismaBooks = async (ctx: Context = context) => {
  return await ctx.prisma.knihy.deleteMany();
};

export const deletePrismaBook = async (id: string, ctx: Context = context) => {
  return await ctx.prisma.knihy.delete({
    where: { id },
  });
};

export const craeteManyPrismaBooks = async (
  books: Book[],
  ctx: Context = context
) => {
  console.log(books.length);
  return await ctx.prisma.knihy.createMany({
    data: books,
  });
};

export const findManyPrismaUniquePrismaBooksColumn = async (
  selectObject: Record<string, boolean>,
  columnName: string,
  ctx: Context = context
) => {
  return await ctx.prisma.knihy.findMany({
    select: selectObject,
    distinct: [columnName as keyof UniqueBookValue],
  });
};
//
export const findUniquePrismaBooks = async (
  id: string,
  ctx: Context = context
) => {
  return await ctx.prisma.knihy.findUnique({
    where: { id },
  });
};

export const loadPrismaBookPage = async (
  where: any,
  page: number,
  limit: number,
  ctx: Context = context
) => {
  return await ctx.prisma.knihy.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    // distinct: ['name'], // Select distinct on the 'name' field
  });
};

export const findManyPrismaBooks = async (ctx: Context = context) => {
  return await ctx.prisma.knihy.findMany();
};

export const countPrismaBooks = async (ctx: Context = context) => {
  return await ctx.prisma.knihy.count();
};
