import { prisma } from '@/lib/prisma';
import * as xlsx from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { truthyValues } from "@/data/values";
export const insertExcelDataToPostgres = async (
  worksheet: xlsx.WorkSheet,
  tableName: string
): Promise<void> => {
  try {
    // Convert worksheet to JSON
    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,  // Use the first row as headers
      defval: null, // Default value for empty cells
    });

    // Extract headers and rows
    const [headers, ...rows] = jsonData;

    if (!headers || headers.length === 0) {
      throw new Error("The Excel file does not contain headers");
    }

    await prisma.knihy.deleteMany();

    // Validate and insert data into the database
    for (const row of rows) {
      try {
        // Check if the row is well-formed
        if (row.length !== headers.length) {
          throw new Error(`Badly formatted row: ${JSON.stringify(row)}`);
        }

        // Map the row data to the Prisma model
        const data: any = headers.reduce((acc: any, header: string, index: number) => {
          let value = row[index];

          // Perform type checks and handle malformed values
          switch (header) {
            case 'id':
              value = value? value: uuidv4(); // Generate a new unique ID if the value is malformed
              break;
            case 'book_code':
              value = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
              break;
            case 'formaturita':
              value = truthyValues.includes(value) ? true : false;
              break;
            case 'available':
              value = truthyValues.includes(value) ? true : false;
              break;
            case 'genres':
              value = value ? value.toString().split(',').map((v: string) => v.trim()) : [];
              break;
            case 'rating':
              value = value ? parseFloat(value) : -1;
              break;
            default:
              value = value ? value.toString().trim() : null;
              break;
          }

          acc[header] = value;
          return acc;
        }, {});

        // Select the Prisma model based on the table name
        let model: any;
        switch (tableName) {
          case 'knihy':
            model = prisma.knihy;
            break;
          // Add cases for other tables if needed
          default:
            throw new Error(`Model for table '${tableName}' not found`);
        }

        // Perform the upsert operation
        // await model.upsert({
        //   where: { id: data.id }, // Adjust the identifier field if necessary
        //   update: data,
        //   create: data,
        // });
        await model.create({
          data: data,
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
    await prisma.$disconnect();
  }
}
// let model: any;
// switch (tableName) {
//   case 'knihy':
//     model = prisma.knihy;
//     break;
//   // Add cases for other tables if needed
//   default:
//     throw new Error(`Model for table '${tableName}' not found`);
// }
