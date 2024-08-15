import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { fillMissingIds, loadExcelSheet } from './excelHandelUtils';
const prisma = new PrismaClient();

type TableName = 'knihy'  ; // Add all your table names here

export const insertExcelDataToPostgres = async (
  filePath: string,
  tableName: TableName
): Promise<void> => {
  try {
    // Read and process the Excel file
    let { worksheet } = loadExcelSheet(filePath);
    worksheet = fillMissingIds(worksheet);

    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    });

    // Extract headers and rows
    const [headers, ...rows] = jsonData;

    if (!headers || headers.length === 0) {
      throw new Error("The Excel file does not contain headers");
    }

    // Validate and insert data into the database
    for (const row of rows) {
      try {
        // Check if row is well-formed
        if (row.length !== headers.length) {
          throw new Error(`Badly formatted row: ${JSON.stringify(row)}`);
        }

        // Map the row data to the Prisma model
        const data = headers.reduce((acc: any, header: string, index: number) => {
          const value = row[index];
          acc[header] = value ? value.toString().trim() : null;
          return acc;
        }, {});

        // Determine the model to use
        let model = prisma.knihy;

        // switch (tableName) {
        //   case 'knihy':
        //     model = prisma.knihy;
        //     break;
        //   case 'anotherTable':
        //     model = prisma.anotherTable;
        //     break;
        //   // Add cases for other tables
        //   default:
        //     throw new Error(`Model for table '${tableName}' not found`);
        // }

        // Perform upsert operation
        await model.upsert({
          where: { id: data.id }, // Adjust the identifier if needed
          update: data,
          create: data,
        });

      } catch (rowError: any) {
        console.error("Error processing row:", rowError.message);
        throw new Error(`Error processing row: ${rowError.message}`);
      }
    }

    console.log("Data successfully inserted or updated in PostgreSQL");
  } catch (error: any) {
    console.error("Error inserting data into PostgreSQL:", error.message);
    throw new Error(`Error inserting data into PostgreSQL: ${error.message}`);
  } finally {
    await prisma.$disconnect(); // Ensure Prisma Client disconnects after operation
  }
};
