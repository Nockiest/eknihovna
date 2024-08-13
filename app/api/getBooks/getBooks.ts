// import { prisma } from '@/data/values';
import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';


export async function GET() {
  try {
    const books = 0 // await prisma.knihy.findMany();
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching books" }, { status: 500 });
  } finally {
    // await prisma.$disconnect();
  }
}
