import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

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

    // Filter out invalid items and prepare for insertion
    const validData = jsonData
    .filter((item) => item.name) // Ensure important fields like name are not empty
    .map((item) => {
      // Construct item with default values
      return {
        id: item.id || uuidv4(),

        // Ensure fields are strings, trim them, and enforce max lengths
        name: typeof item.name === "string" ? item.name.trim().substring(0, 255) : "", // Trims and limits to 255 characters
        author: typeof item.author === "string" ? item.author.trim().substring(0, 255) : "", // Trims and limits to 255 characters
        category: typeof item.category === "string" ? item.category.trim().substring(0, 50) : "", // Trims and limits to 50 characters
        signatura: typeof item.signatura === "string" ? item.signatura.trim().substring(0, 50) : "", // Trims and limits to 50 characters
        zpusob_ziskani: typeof item.zpusob_ziskani === "string" ? item.zpusob_ziskani.trim().substring(0, 100) : "", // Trims and limits to 100 characters

        // Ensure genres are an array of strings, trimming and filtering out empty values
        genres: Array.isArray(item.genres)
          ? item.genres
              .map((v:any) => (typeof v === "string" ? v.trim().substring(0, 50) : "")) // Ensure genres are strings, trim, limit length
              .filter(Boolean) // Remove empty strings
          : [],

        formaturita: Boolean(item.formaturita), // Coerce to boolean
        available: Boolean(item.available), // Coerce to boolean

        // Validate rating, set to null if invalid or NaN, otherwise convert to number
        rating:
          item.rating !== null && !isNaN(Number(item.rating)) && item.rating >= 0
            ? Number(item.rating)
            : null, // Set to null if rating is NaN, null, or invalid
      };
    });

    // Insert valid data into the database
    await prisma.knihy.createMany({
      data: validData,
    });

    return NextResponse.json(
      { success: true, message: "Data inserted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to insert data" },
      { status: 500 }
    );
  }

      // Filter out any items that have critical fields empty (modify as necessary)


  }



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
