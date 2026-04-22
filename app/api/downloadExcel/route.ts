import { findManyPrismaBooks, upsertPrismaBackup } from '@/lib/prisma';
import * as xlsx from 'xlsx';
import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders, noCacheHeaders } from '@/data/values';
export const revalidate = 0;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  try {
    console.log(`GET`);

    const adminname = req.headers.get('x-admin-name') || 'unknown-admin';

    const data = await findManyPrismaBooks();
    console.log(data.length);

    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in the table.' });
    }

    const jsonData = data.map((item: any) => {
      const { updatedat, ...rest } = JSON.parse(JSON.stringify(item));
      return rest;
    });

    jsonData.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        if (Array.isArray(row[key])) {
          row[key] = row[key].join(', ');
        } else if (typeof row[key] === 'boolean') {
          row[key] = row[key] ? 'ano' : 'ne';
        }
      });
    });

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'knihy');
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    await upsertPrismaBackup({
      id: `${new Date().toISOString()}-${adminname}`,
      adminname,
    });

    console.log(`Backup logged for admin: ${adminname}`);

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="knihyGO.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ...noCacheHeaders,
        ...getCorsHeaders(req.headers.get("origin")),
      },
    });
  } catch (error) {
    console.error('Error fetching data or creating Excel file:', error);
    return NextResponse.json({ error: 'Problém na straně serveru' });
  }
}
