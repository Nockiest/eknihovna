import { context, findManyPrismaBooks, upsertPrismaBackup } from '@/lib/prisma';
import * as xlsx from 'xlsx';
import { NextRequest, NextResponse } from 'next/server';
import { noCacheHeaders } from '@/data/values';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    console.log(`GET`);

    // Simulate extracting admin's name from authentication context or headers
    const adminname = req.headers.get('x-admin-name') || 'unknown-admin'; // Replace with actual authentication logic

    // Fetch books data
    const data = await findManyPrismaBooks();
    console.log(data.length);

    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in the table.' });
    }

   // Convert Prisma query result to JSON and omit 'updatedat' column
   const jsonData = data.map((item: any) => {
    const { updatedat, ...rest } = JSON.parse(JSON.stringify(item));
    return rest;
  });
    // Format the rows (e.g., arrays as comma-separated, booleans as "ano"/"ne")
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

    // Save the backup record
    await upsertPrismaBackup({
      id: `${new Date().toISOString()}-${adminname}`, // Unique ID (timestamp + admin name)
      adminname,
    });

    console.log(`Backup logged for admin: ${adminname}`);

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="knihyGO.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ...noCacheHeaders,
      },
    });
  } catch (error) {
    console.error('Error fetching data or creating Excel file:', error);
    return NextResponse.json({ error: 'Problém na straně serveru' });
  }
}
