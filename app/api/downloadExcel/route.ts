import { context, findManyPrismaBooks } from '@/lib/prisma';
import * as xlsx from 'xlsx';
import { NextResponse } from 'next/server';
import { noCacheHeaders } from '@/data/values';
export const revalidate = 0
export  async function GET( ) {
  try {
    console.log(`GET`)
    const data = await findManyPrismaBooks();
    console.log(data.length)
    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in the table.' });
    }

    // Convert Prisma query result to JSON
    const jsonData = data.map((item: any) => JSON.parse(JSON.stringify(item)));

    // Join array values into a string separated by commas (if needed)
    jsonData.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        if (Array.isArray(row[key])) {
          row[key] = row[key].join(', ');
        } else if (typeof row[key] === 'boolean') {
          row[key] = row[key] ? 'ano' : 'ne';
        }
      });
    });

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'knihy');

    // Write the workbook to a buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
        headers: {
          'Content-Disposition': 'attachment; filename="table_data.xlsx"',
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          ...noCacheHeaders
        },
      });
  } catch (error) {
    console.error('Error fetching data or creating Excel file:', error);
    NextResponse.json({ error: 'Problém na straně serveru' });
  }
}
