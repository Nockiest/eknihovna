import { prisma } from '@/lib/prisma';
import * as xlsx from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { truthyValues } from "@/data/values";
import { UploadJsonData } from '@/types/types';
export const insertJsonDataToPostgres = async (
  jsonData: UploadJsonData  ,
  tableName: string
): Promise<void> => {
  try {
    const { headers,   rows } = jsonData;
    console.log("json data",jsonData)
    console.log( headers,   rows)

    if (!jsonData.headers || !jsonData.rows) {
      throw new Error('Invalid JSON data');
    }

    console.log('Processing rows...');

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
        let model;
        switch (tableName) {
          case 'knihy':
            model = prisma.knihy;
            break;
          // Add cases for other tables if needed
          default:
            throw new Error(`Model for table '${tableName}' not found`);
        }

        // Perform the upsert operation
        await model.upsert({
          where: { id: data.id }, // Adjust the identifier field if necessary
          update: data,
          create: data,
        });

        // Log the number of books after each insertion for debugging
        const bookNum = await model.count(); // Use count() to get the number of records
        console.log(`Number of books after insertion: ${bookNum}`);
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
