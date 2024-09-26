import { NextRequest, NextResponse } from "next/server";
import { insertJsonDataToPostgres } from "./insertJsonlDataIntoPostgres"; // Assuming this function exists
import { prisma } from "@/lib/prisma";
import { Book, UploadJsonData } from "@/types/types";
import { corsHeaders, noCacheHeaders, truthyValues } from "@/data/values";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import * as xlsx from "xlsx";
import getRawBody from "raw-body";
import { Readable } from "stream"; // Import Readable from 'stream'
import { IncomingForm, File as FormidableFile } from "formidable";
// export async function POST(req: NextRequest) {
//   debugger;
//   try {
//     const contentType = req.headers.get("Content-Type");

//     // Check if the request is JSON
//     if (contentType && contentType.includes("application/json")) {
//       const jsonData: UploadJsonData = await req.json();
//       console.log(jsonData);
//       // console.log(jsonData.headers);
//       console.log(jsonData.rows);

//       if (!jsonData.rows) {
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Invalid JSON data",
//             details: jsonData.rows,
//           },
//           {
//             headers: {
//               ...corsHeaders,
//               ...noCacheHeaders,
//             },
//           }
//         );
//       }

//       try {
//         await insertJsonDataToPostgres(jsonData, "knihy");
//       } catch (dbError: any) {
//         console.error("Database insertion error:", dbError);
//         return NextResponse.json(
//           {
//             success: false,
//             error: "Database insertion error",
//             details: dbError.message,
//           },
//           {
//             headers: {
//               ...corsHeaders,
//               ...noCacheHeaders,
//             },
//           }
//         );
//       }

//       return NextResponse.json(
//         { success: true, message: "Data úspěšně zpracována" },
//         {
//           headers: {
//             ...corsHeaders,
//             ...noCacheHeaders,
//           },
//         }
//       );
//     } else {
//       // Handle the case when the content type is not JSON
//       return NextResponse.json(
//         { success: false, error: "Špatný content type" },
//         { headers: { ...corsHeaders, ...noCacheHeaders } }
//       );
//     }
//   } catch (error: any) {
//     console.error("Error při zpracováni dat:", error.message);
//     return NextResponse.json(
//       { success: false, error: "Server error", details: error.message },
//       { headers: { ...corsHeaders, ...noCacheHeaders } }
//     );
//   }
// }

// Disable body parsing by Next.js since we're handling the file upload
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: NextRequest) {
  try {
    // Check if the request has a JSON body
    const jsonData = await req.json();
    if (!jsonData || !Array.isArray(jsonData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data format. Expected an array of books.",
        },
        { status: 400 }
      );
    }

    // Validate and insert the JSON data into the database
    await prisma.knihy.createMany({
      data: jsonData.map((item) => {
        console.log(item); // Log the item separately
        return {
          id: item.id || uuidv4(),
          name: String(item.name || ""),         // Ensure 'name' is a string
          author: String(item.author || ""),     // Ensure 'author' is a string
          category: String(item.category || ""), // Ensure 'category' is a string
          signatura: String(item.signatura || ""), // Ensure 'signatura' is a string
          zpusob_ziskani: String(item.zpusob_ziskani || ""),
          genres: item.genres
            ? item.genres
                .toString()
                .split(",")
                .map((v: string) => v.trim())
            : [],
          formaturita: Boolean(item.formaturita), // Coerce to boolean
          available: Boolean(item.available), // Coerce to boolean
          rating:
            item.rating !== null && item.rating !== undefined
              ? Number(item.rating)
              : -1,
        };
      }),
    });
    return NextResponse.json(
      { success: true, message: "Data inserted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { success: false, message: "Server error occurred" },
      { status: 500 }
    );
  }
}
//   jsonData.map((item) => (
//   console.log(item); // Log the item separately
//   return {
//   id: item.id || uuidv4(),
//   name: item.name? item.name||'',
//   author: item.author? item.author||'',
//   category: item.category,
//   signatura: item.signatura,
//   zpusob_ziskani: item.zpusob_ziskani,
//   genres: item.genres ? item.genres.toString().split(',').map((v: string) => v.trim()) : [],
//   formaturita: Boolean(item.formaturita), // Coerce to boolean
//   available: Boolean(item.available),     // Coerce to boolean
//   rating: item.rating !== null && item.rating !== undefined ? Number(item.rating) : -1,
// })),
// skipDuplicates: true, // Avoid duplicates

// Convert formidable to promise-based to handle parsing
//   const formParse = (req: any): Promise<{ fields: any; files: any }> =>
//     new Promise((resolve, reject) => {
//       const form = new IncomingForm();
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//   try {
//     // Wait for form to be parsed
//     const { files } = await formParse(req as any);

//     if (!files || !files.file) {
//       return NextResponse.json(
//         { success: false, error: "File parse error" },
//         { status: 400 }
//       );
//     }

//     const uploadedFile = files.file as unknown as FormidableFile | FormidableFile[];
//     const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

//     // Read the Excel file
//     const workbook = xlsx.readFile(file.filepath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // Convert sheet to JSON
//     const jsonData = xlsx.utils.sheet_to_json(sheet) as Book[];
//     console.log(jsonData);

//     // Bulk insert to Prisma (PostgreSQL)
//     await prisma.knihy.createMany({
//       data: jsonData.map((item: Book) => ({
//         id: item.id ? item.id : uuidv4(),
//         name: item.name,
//         author: item.author,
//         category: item.category,
//         signatura: item.signatura,
//         zpusob_ziskani: item.zpusob_ziskani,
//         genres: item.genres
//           ? item.genres
//               .toString()
//               .split(',')
//               .map((v: string) => v.trim())
//           : [],
//         formaturita: truthyValues.includes(item?.formaturita?.toString() || ''),
//         available: truthyValues.includes(item?.available?.toString() || ''),
//         rating: item.rating !== null && item.rating !== undefined ? item.rating : -1,
//       })),
//       skipDuplicates: true, // Avoid duplicates
//     });

//     return NextResponse.json(
//       { success: true, message: `Data inserted successfully!` },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: `Database insertion error` },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(req: NextRequest) {
  try {
    // Extract the ID from the request body
    let { id } = await req.json();

    // Ověříme, zda je id platné a přetypujeme na string
    if (id !== undefined && id !== null) {
      id = String(id).trim(); // Převod na string a ořezání prázdných znaků
    } else {
      return NextResponse.json(
        { success: false, error: "ID neposkytnuto" },
        { status: 400 }
      );
    }
    console.log(id, parseInt(id) == -1);
    console.log(typeof id === "string");
    if (parseInt(id) == -1) {
      console.log("x");
      const deleteResult = await prisma.knihy.deleteMany();
      console.log("returning");
      return NextResponse.json(
        {
          success: true,
          message: `smazáno  ${deleteResult.count} knih`,
        },
        { status: 200 }
      );
    } else if (id && typeof id === "string") {
      // Check if a book with the provided ID exists
      console.log("deleting", id);
      const book = await prisma.knihy.delete({
        where: { id },
      });
      console.log("deleted", book);
      if (!book) {
        return NextResponse.json(
          {
            success: false,
            error: `Kniha s id: ${id} v databázi neexistuje`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, message: `Kniha '${book.name}' byla úspěšně smazána` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "ID neposkytnuto",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
// export async function POST(req: NextRequest) {
//   console.log("POST request received");
//   try {
//     const data = await req.formData();
//     const file: File | null = data.get("file") as unknown as File;
//     if (!file) {
//       console.error("No file uploaded");
//       return NextResponse.json({ success: false, message: "No file uploaded" });
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     const workbook = xlsx.read(buffer, { type: "buffer" });
//     let worksheet = workbook.Sheets[workbook.SheetNames[0]];

//     // Ensure transformations succeed
//     try {
//       worksheet = excelWordsToBool(worksheet, "available");
//       worksheet = excelWordsToBool(worksheet, "formaturita");
//       worksheet = fillMissingIds(worksheet);
//     } catch (transformError:any) {
//       console.error("Error transforming data:", transformError);
//       return NextResponse.json({
//         success: false,
//         error: "Data transformation error",
//         details: transformError?.message,
//       });
//     }

//     // Insert data into PostgreSQL
//     try {
//       await insertExcelDataToPostgres(worksheet, "knihy");
//     } catch (dbError: any) {
//       console.error("Database insertion error:", dbError);
//       return NextResponse.json({
//         success: false,
//         error: "Database insertion error",
//         details: dbError.message,
//       });
//     }

//     return NextResponse.json({ success: true, message: "File processed and uploaded successfully" });
//   } catch (error: any) {
//     console.error("Error processing data:", error);
//     return NextResponse.json({ success: false, error: "Server error", details: error.message });
//   }
// }
// async function findDuplicates() {
//   const books = await prisma.knihy.findMany();
//   const bookCodes = books.map(book => book.book_code);
//   const uniqueBookCodes = [...new Set(bookCodes)];

//   const duplicates = uniqueBookCodes.filter(code => bookCodes.indexOf(code) !== bookCodes.lastIndexOf(code));

//   return duplicates;
// }

// async function deleteDuplicates() {
//   const duplicates = await findDuplicates();

//   for (const duplicate of duplicates) {
//     // Delete all occurrences of the duplicate except the first one
//     const booksToDelete = await prisma.knihy.findMany({
//       where: {
//         book_code: duplicate,
//       },
//       skip: 1, // Skip the first occurrence
//     });

//     for (const book of booksToDelete) {
//       await prisma.knihy.delete({
//         where: {
//           id: book.id,
//         },
//       });
//     }
//   }
// }

// // Determine the appropriate error response
// let errorMessage = 'Internal Server Error';
// if (
//   error.message === 'No file uploaded' ||
//   error.message.startsWith('File not found')
// ) {
//   errorMessage = error.message;
// } else if (error.message === 'Badly formatted row') {
//   errorMessage = 'Some rows in the file are badly formatted';
// } else if (
//   error.message.startsWith('Error inserting data into PostgreSQL')
// ) {
//   errorMessage = 'Error inserting data into the database';
// }

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

// Helper function to handle file upload
//   const handleFileUpload = async (req: NextApiRequest): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const uploadDir = path.join(process.cwd(), 'uploads');
//       fs.ensureDirSync(uploadDir); // Ensure upload directory exists

//       const busboy = new Busboy({ headers: req.headers });
//       let filePath = '';

//       busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//         filePath = path.join(uploadDir, filename);
//         file.pipe(fs.createWriteStream(filePath));
//       });

//       busboy.on('finish', () => {
//         if (!filePath) {
//           return reject(new Error('No file uploaded'));
//         }
//         resolve(filePath);
//       });

//       busboy.on('error', (err) => {
//         reject(err);
//       });

//       req.pipe(busboy);
//     });
//   };
