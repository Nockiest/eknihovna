import { NextRequest, NextResponse } from "next/server";
import { insertJsonDataToPostgres } from "./insertJsonlDataIntoPostgres"; // Assuming this function exists
import { prisma } from "@/lib/prisma";
import { UploadJsonData } from "@/types/types";
import { corsHeaders, noCacheHeaders } from "@/data/values";

export async function POST(req: NextRequest) {
  debugger;
  try {
    const contentType = req.headers.get("Content-Type");

    // Check if the request is JSON
    if (contentType && contentType.includes("application/json")) {
      const jsonData: UploadJsonData = await req.json();
      console.log(jsonData);
      // console.log(jsonData.headers);
      console.log(jsonData.rows);

      if ( !jsonData.rows) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid JSON data",
            details: jsonData.rows,
          },
          {
            headers: {
              ...corsHeaders,
              ...noCacheHeaders
            },
          }
        );
      }

      try {
        await insertJsonDataToPostgres(jsonData, "knihy");
      } catch (dbError: any) {
        console.error("Database insertion error:", dbError);
        return NextResponse.json(
          {
            success: false,
            error: "Database insertion error",
            details: dbError.message,
          },
          {
            headers: {
              ...corsHeaders,
              ...noCacheHeaders
            },
          }
        );
      }

      return NextResponse.json(
        { success: true, message: "Data úspěšně zpracována" },
        {
          headers: {
            ...corsHeaders,
            ...noCacheHeaders
          },
        }
      );
    } else {
      // Handle the case when the content type is not JSON
      return NextResponse.json(
        { success: false, error: "Špatný content type" },
        { headers: { ...corsHeaders, ...noCacheHeaders } }
      );
    }
  } catch (error: any) {
    console.error("Error při zpracováni dat:", error.message);
    return NextResponse.json(
      { success: false, error: "Server error", details: error.message },
      { headers: { ...corsHeaders, ...noCacheHeaders } }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Extract the ID from the request body
    const { id } = await req.json();

    // Validate that an ID is provided
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID neposkytnuto',
      }, { status: 400 });
    }

    // Check if a book with the provided ID exists
    const book = await prisma.knihy.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({
        success: false,
        error: `Kniha s id: ${id} v databázi neexistuje`,
      }, { status: 404 });
    }

    // Delete the book with the provided ID
    const deleteResult = await prisma.knihy.delete({
      where: { id },
    });

    // Return a success response with the deleted book ID
    return NextResponse.json({
      success: true,
      message: `Kniha s ID ${id} úspěšně smazána`,
    });
  } catch (error: any) {
    console.error('Error deleting book:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error.message,
    }, { status: 500 });
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
