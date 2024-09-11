import { prisma } from '@/lib/prisma';
import * as xlsx from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { truthyValues } from "@/data/values";
import { UploadJsonData } from '@/types/types';
import { NextResponse } from 'next/server';
export const insertJsonDataToPostgres = async (
  jsonData: UploadJsonData  ,
  tableName: string
): Promise<void> => {
  try {
    const {     rows } = jsonData;
    console.log(   rows)
const headers = [
  'id', 'book_code', 'name', 'author',   'category', 'genres', 'umisteni', 'signatura', 'zpusob_ziskani','formaturita', 'available',  'rating',
]
    if ( !rows || !Array.isArray(rows)) {
      throw new Error("Invalid JSON data: rows are missing or not an array");
    }

    console.log('Processing rows...');

    // Validate and insert data into the database
    for (const row of rows) {
      try {
        // Check if the row is well-formed
        if (row.length !== headers.length) {
          console.error(`Badly formatted row: ${JSON.stringify(row)}`);
          NextResponse.json({ error: `Badly formatted row: ${JSON.stringify(row)}` }, { status: 400 });
        }

        // Map the row data to the Prisma model
        // const data: any = headers.reduce((acc: any, header: string, index: number) => {
        //   let value = row[index];
        const rowObject = headers.reduce((acc: any, header: string, index: number) => {
          acc[header] = row[index] !== undefined ? row[index] : null; // Ensure undefined values are handled
          return acc;
        }, {});

        // Build the data object using the correct rowObject
        const data = {
          id: rowObject.id ? rowObject.id : uuidv4(),
          book_code: isNaN(parseInt(rowObject.book_code, 10)) ? null : parseInt(rowObject.book_code, 10),
          formaturita: truthyValues.includes(rowObject.formaturita) ? true : false,
          available: truthyValues.includes(rowObject.available) ? true : false,
          genres: rowObject.genres ? rowObject.genres.toString().split(',').map((v: string) => v.trim()) : [],
          rating: rowObject.rating !== null ? parseFloat(rowObject.rating) : -1,
          name: rowObject.name,
          author: rowObject.author,
          category: rowObject.category,
          umisteni: rowObject.umisteni,
          signatura: rowObject.signatura,
          zpusob_ziskani: rowObject.zpusob_ziskani,
        };
        console.log(data)

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
        console.log('data:', data)
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
           NextResponse.json({ error: `Error processing row: ${rowError.message}` }, { status: 400 });
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


 //   // Perform type checks and handle malformed values
        //   switch (header) {
        //     case 'id':
        //       value = value? value: uuidv4(); // Generate a new unique ID if the value is malformed
        //       break;
        //     case 'book_code':
        //       value = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
        //       break;
        //     case 'formaturita':
        //       value = truthyValues.includes(value) ? true : false;
        //       break;
        //     case 'available':
        //       value = truthyValues.includes(value) ? true : false;
        //       break;
        //     case 'genres':
        //       value = value ? value.toString().split(',').map((v: string) => v.trim()) : [];
        //       break;
        //     case 'rating':
        //       value = value ? parseFloat(value) : -1;
        //       break;
        //     default:
        //       value = value ? value.toString().trim() : null;
        //       break;
        //   }

        //   acc[header] = value;
        //   return acc;
        // }, {});
