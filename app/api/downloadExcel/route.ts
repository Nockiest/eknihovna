import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';
import * as xlsx from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tableName } = req.query;

  if (!tableName || typeof tableName !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing tableName parameter' });
  }

  try {
    let data;
    switch (tableName) {
      case 'knihy':
        data = await prisma.knihy.findMany();
        break;
      // Add more cases for other tables as needed
      default:
        return res.status(400).json({ error: 'Invalid table name' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found in the table.' });
    }

    // Convert Prisma query result to JSON
    const jsonData = data.map((item:any) => {
      return JSON.parse(JSON.stringify(item));
    });

    // Join array values into a string separated by commas (if needed)
    jsonData.forEach((row:any) => {
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
    xlsx.utils.book_append_sheet(workbook, worksheet, tableName);

    // Write the workbook to a buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers and send the buffer as a downloadable Excel file
    res.setHeader('Content-Disposition', 'attachment; filename="table_data.xlsx"');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  } catch (error) {
    console.error('Error fetching data or creating Excel file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
