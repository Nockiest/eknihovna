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

// add prisma functions wiht ctx here

export const upsertPrismaBackup = async (backup: { id: string; adminname?: string }, ctx: Context = context) => {
  return await ctx.prisma.backups.upsert({
    where: { id: backup.id },
    update: backup, // Update if the ID already exists
    create: backup, // Create if the ID doesn't exist
  });
};
export const getNewestBackupByAdmin = async (adminname: string, ctx: Context = context) => {
  return await ctx.prisma.backups.findFirst({
    where: { adminname },
    orderBy: { backupat: 'desc' }, // Order by the most recent backup
  });
};


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
    where: { id,   },
  });
};

export const findPrismaBookByFields = async (
  fields: { key: keyof Book; value: any }[],
  ctx: Context = context
) => {
  const where = Object.fromEntries(fields.map(({ key, value }) => [key, value])); // Dynamically create the where clause based on the provided key-value pairs
  return await ctx.prisma.knihy.findMany({
    where,
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

const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const getOpeningHours = async (ctx: Context = context) => {
  const hours = await ctx.prisma.opening_hours.findMany();
  return hours.sort((a, b) => DAY_ORDER.indexOf(a.id) - DAY_ORDER.indexOf(b.id));
};

export const upsertOpeningHours = async (
  hours: { id: string; day: string; open: string | null; close: string | null }[],
  ctx: Context = context
) => {
  return await Promise.all(
    hours.map((h) =>
      ctx.prisma.opening_hours.upsert({
        where: { id: h.id },
        update: { open: h.open, close: h.close },
        create: h,
      })
    )
  );
};
