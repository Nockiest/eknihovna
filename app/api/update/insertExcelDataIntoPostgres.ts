import prisma from "@/app/lib/prisma";
import { fillMissingIds, loadExcelSheet } from "./excelHandelUtils";
import * as xlsx from 'xlsx'
export const insertExcelDataToPostgres = async (
  filePath: string,
  tableName: string
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

        // Insert or update the data using Prisma
        await prisma[tableName].upsert({
          where: { id: data.id }, // Assuming 'id' is the unique identifier
          update: data,
          create: data,
        });
      } catch (rowError:any) {
        console.error("Error processing row:", rowError.message);
        throw new Error(`Error processing row: ${rowError.message}`);
      }
    }

    console.log("Data successfully inserted or updated in PostgreSQL");
  } catch (error:any) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw new Error(`Error inserting data into PostgreSQL: ${error.message}`);
  }
  // finally {
  //   await prisma.$disconnect(); // Ensure Prisma Client disconnects after operation
  // }
};