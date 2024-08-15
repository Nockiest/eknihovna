import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { Fields, Files, IncomingForm } from 'formidable';
import { insertExcelDataToPostgres } from './insertExcelDataIntoPostgres';// Assuming this function exists
import { excelWordsToBool, fillMissingIds } from './excelHandelUtils';
// import { excelWordsToBool, fillMissingIds } from '@/lib/excelUtils'; // Assuming these utilities exist

// Disable body parsing to allow Formidable to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility to handle incoming file uploads
const parseForm = async (req: NextApiRequest): Promise<{ fields: Fields, filePath: string }> => {
    return new Promise((resolve, reject) => {
      const uploadDir = path.join(process.cwd(), '/uploads'); // Define upload directory
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // Create directory if it doesn't exist

      const form = new IncomingForm({
        uploadDir, // Set the upload directory
        keepExtensions: true, // Keep file extensions
        multiples: false, // If you want to allow multiple files, set this to true
      });

      form.parse(req, (err, fields, files: Files) => {
        if (err) return reject(err);
        if (!files.file) return reject(new Error('No file uploaded'));

        // Assuming files.file is a single file (not an array)
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        resolve({ fields, filePath: file.filepath });
      });
    });
  };

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Handle file upload
    const { filePath } = await parseForm(req);

    // Specify the expected file path
    const expectedFilePath = path.join(process.cwd(), 'uploads', 'knihy.xlsx');

    // Ensure file exists
    if (!fs.existsSync(expectedFilePath)) {
      throw new Error(`File not found at path: ${expectedFilePath}`);
    }

    // Load Excel sheet
    const workbook = xlsx.readFile(filePath);
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Apply data transformations
    worksheet = excelWordsToBool(worksheet, 'available');
    worksheet = excelWordsToBool(worksheet, 'formaturita');
    worksheet = fillMissingIds(worksheet);

    // Insert data into PostgreSQL
    await insertExcelDataToPostgres(expectedFilePath, 'knihy');

    // Respond with success
    res.status(200).json({ message: 'File processed and uploaded successfully' });
  } catch (error:any) {
    console.error('Error processing data:', error);

    // Determine the appropriate error response
    let errorMessage = 'Internal Server Error';
    if (
      error.message === 'No file uploaded' ||
      error.message.startsWith('File not found')
    ) {
      errorMessage = error.message;
    } else if (error.message === 'Badly formatted row') {
      errorMessage = 'Some rows in the file are badly formatted';
    } else if (
      error.message.startsWith('Error inserting data into PostgreSQL')
    ) {
      errorMessage = 'Error inserting data into the database';
    }

    res.status(500).json({ error: errorMessage });
  }
}
