
// make sure you run npx tsc -w before using this file
import express, { Request, Response } from 'express';
import cors from 'cors';
import xlsx from 'xlsx'
import dotenv from 'dotenv';
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { connectAndQuery, extractValuesFromArrayColumn, fetchAndCreateExcel, insertExcelDataToPostgres,  query } from './db';
// import bcrypt from 'bcrypt';
import bodyParser from 'body-parser'
import { excelWordsToBool,   fillMissingIds,   } from './excelUtils';

dotenv.config();
const knihyURL = process.env.KNIHY_URL
const port = 3002;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '');
  },
  filename: (req, file, cb) => {
    cb(null, 'knihy.xlsx');
  }
});

const upload = multer({ storage });
app.post('/bookList', async (req, res) => {
  const { filters } = req.body;

  let sqlQuery = 'SELECT * FROM knihy';
  const queryParams = [];
  console.log(filters)
  if (filters) {
    const filterKeys = Object.keys(filters);
    if (filterKeys.length > 0) {
      const conditions = filterKeys.map((key, index) => {
        queryParams.push(filters[key]);
        return `${key} = $${index + 1}`;
      });

      sqlQuery += ` WHERE ${conditions.join(' AND ')}`;
    }
  }

  try {
    const result = await query(sqlQuery,queryParams );
    // const result = await pool.query(sqlQuery, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUniqueValues', async (req, res) => {
  const { columnName } = req.query; // Use req.query to get query parameters
  console.log(columnName); // Debugging: Ensure columnName is correctly received

  try {
    const values = await extractValuesFromArrayColumn(columnName as string, true); // Assuming extractValuesFromArrayColumn returns unique values
    res.json(values);
  } catch (error) {
    console.error('Error retrieving values:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/downloadExcel', async (req: Request, res: Response) => {
  try {
    const buffer = await fetchAndCreateExcel('knihy'); // Replace 'knihy' with your table name
    res.setHeader('Content-Disposition', 'attachment; filename="stav_knih_na_serveru.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
    console.log('downloading excel')
  } catch (error) {
    console.error('Error generating or sending Excel file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/authenticate", (req, res) => {
  const { password } = req.body;
  console.log(password, password.trim() === process.env.UPLOAD_PASSWORD);

  if (!password) {
    return res.status(400).json({ error: "vyžadováno heslo" });
  }

  if (password === process.env.UPLOAD_PASSWORD) {
    res.status(200).json({ message: "Uživatel autorizován" });
  } else {
    return res.status(401).json({ error: "Špatné heslo" });
  }
  // bcrypt.compare(password, process.env.UPLOAD_PASSWORD_HASHED, (err, result) => {
  //   if (err || !result) {
  //     return res.status(401).json({ error: 'Špatné heslo' });
  //   }

  // Password correct, return success
  //   res.status(200).json({ message: 'Uživatel autorizován' });
  // });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.post('/update', upload.single('file'), async (req, res) => {
  try {
    // Handle file upload with Multer
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Specify the file path
    const filePath = path.join(__dirname, '../', 'knihy.xlsx'); // Adjust the path as needed

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Read the uploaded file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];

    // Apply data transformations
    worksheet = excelWordsToBool(worksheet, 'available');
    worksheet = excelWordsToBool(worksheet, 'formaturita');
    worksheet = fillMissingIds(worksheet);
    console.log('x')
    // Insert data into PostgreSQL
    await insertExcelDataToPostgres(filePath, 'knihy'); // Assuming insertExcelDataToPostgres is async

    // Respond with success message
    res.status(200).json({ message: 'File processed and uploaded successfully' });
  } catch (error) {
    console.error('Error processing data:', error);

    // Determine the appropriate error response
    let errorMessage = 'Internal Server Error';
    if (error.message === 'No file uploaded' || error.message.startsWith('File not found')) {
      errorMessage = error.message;
    } else if (error.message === 'Badly formatted row') {
      errorMessage = 'Some rows in the file are badly formatted';
    } else if (error.message.startsWith('Error inserting data into PostgreSQL')) {
      errorMessage = 'Error inserting data into the database';
    }

    res.status(500).json({ error: errorMessage });
  }
});
