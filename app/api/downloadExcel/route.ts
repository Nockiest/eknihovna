import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import * as xlsx from 'xlsx';
import { NextResponse } from 'next/server';
//req: NextApiRequest, res: NextApiResponse


export  async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log('GET');
  try {
    const data = await prisma.knihy.findMany();
    console.log(data)
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

    // Set headers and send the buffer as a downloadable Excel file
    res.setHeader('Content-Disposition', 'attachment; filename="table_data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error fetching data or creating Excel file:', error);
    NextResponse.json({ error: 'Internal Server Error' });
  }
}

   // let data;
    // switch (tableName) {
    //   case 'knihy':
    //     data = await prisma.knihy.findMany();
    //     break;
    //   // Add more cases for other tables as needed
    //   default:
    //     return res.status(400).json({ error: 'Invalid table name' });
    // }