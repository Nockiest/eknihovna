import { NextApiRequest, NextApiResponse } from 'next';
import * as xlsx from 'xlsx';
import { insertExcelDataToPostgres } from './insertExcelDataIntoPostgres';// Assuming this function exists
import { excelWordsToBool, fillMissingIds } from './excelHandelUtils';

import { IncomingMessage } from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { Readable } from 'stream';
import { NextRequest, NextResponse } from 'next/server';

// Promisify fs functions
const pipeline = util.promisify(require('stream').pipeline);

export async function parseMultipartForm(req: IncomingMessage): Promise<{ fields: any, files: any }> {
  return new Promise((resolve, reject) => {
    console.log(req.headers['content-type'])
    if (req.headers['content-type'] === undefined || !req.headers['content-type'].startsWith('multipart/form-data')) {
      return reject(new Error('Content-Type must be multipart/form-data'));
    }

    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return reject(new Error('Boundary not found'));
    }

    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      const parts = buffer.split(`--${boundary}`);
      const fields: any = {};
      const files: any = {};

      for (const part of parts) {
        const [headers, body] = part.split('\r\n\r\n');
        if (!body) continue;

        // Handle file uploads
        if (headers.includes('Content-Disposition: form-data')) {
          const dispositionMatch = /Content-Disposition: form-data; name="([^"]+)"; filename="([^"]+)"/.exec(headers);
          if (dispositionMatch) {
            const fieldName = dispositionMatch[1];
            const fileName = dispositionMatch[2];
            const filePath = path.join(process.cwd(), 'uploads', fileName);

            // Save file
            const writeStream = fs.createWriteStream(filePath);
            await pipeline(Readable.from([body]), writeStream);
            files[fieldName] = { filePath };
          } else {
            // Handle regular fields
            const nameMatch = /Content-Disposition: form-data; name="([^"]+)"/.exec(headers);
            if (nameMatch) {
              const fieldName = nameMatch[1];
              fields[fieldName] = body.toString();
            }
          }
        }
      }

      resolve({ fields, files });
    });

    req.on('error', err => reject(err));
  });
}
// Disable body parsing to allow Formidable to handle file uploads
  // Handle file upload
    //   const { fields, files } = await parseMultipartForm(req);
    //   const filePath = files['file']?.filePath;
    //   console.log('File path:', filePath);

  export   async function POST(req: NextRequest, res: NextApiResponse) {
    console.log('POST request received');
    try {

    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
console.log(file)
    if (!file) {
      return NextResponse.json({ success: false })
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Load the Excel sheet directly from the buffer
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Apply data transformations
      worksheet = excelWordsToBool(worksheet, 'available');
      worksheet = excelWordsToBool(worksheet, 'formaturita');
      worksheet = fillMissingIds(worksheet);

      // Insert data into PostgreSQL
      await insertExcelDataToPostgres(worksheet, 'knihy');
      // Respond with success
      res.status(200).json({ message: 'File processed and uploaded successfully' });
    } catch (error: any) {
      console.error('Error processing data:', error);



      res.status(500).json({ error: error.message  });
    }
  }

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