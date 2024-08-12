import express, { Request, Response } from "express";
import cors from "cors";
import xlsx from "xlsx";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  buildFilterQuery,
  connectAndQuery,
  extractValuesFromArrayColumn,
  fetchAndCreateExcel,
  insertExcelDataToPostgres,
  query,
} from "./db";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { excelWordsToBool, fillMissingIds, loadExcelSheet } from "./excelUtils";
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'
import { SignJWT } from "jose";
// make sure you run npx tsc -w before using this file
const cookieParser = require('cookie-parser');
// const verifyToken = require('./verifyToken'); // Path to your verifyToken middleware


dotenv.config();
const knihyURL = process.env.KNIHY_URL;
const port = 3002;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
  filename: (req, file, cb) => {
    cb(null, "knihy.xlsx");
  },
});

const upload = multer({ storage });
const defaultQuery = "SELECT * FROM knihy";

app.post("/bookList", async (req, res) => {
  const { filters, page = 1, limit = 10 } = req.body;
  let sqlQuery = "SELECT DISTINCT ON (name) * FROM knihy";

  if (!filters) {
    return res.status(400).json({ error: "Server didn't receive filters" });
  }
  if (page <= 0) {
    return res.status(400).json({ error: "page number was set to 0" });
  }
  const { whereClause, queryParams } = buildFilterQuery(filters);
  sqlQuery += ` ${whereClause} LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  console.log(sqlQuery, page, limit);
  // Calculate offset
  const offset = (page - 1) * limit;
  queryParams.push(limit, offset);

  try {
    const result = await query(sqlQuery, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error("Error executing search query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/uniqueNamesCount", async (req, res) => {
  const sqlQuery = "SELECT COUNT(DISTINCT name) AS uniqueNamesCount FROM knihy";
  try {
    const result = await query(sqlQuery);
    if (result.rows.length > 0) {
      // @ts-ignore
      res.json(result.rows[0].uniquenamescount);
    } else {
      res.status(404).json({ error: "No data found" });
    }
  } catch (error) {
    console.error("Error executing count query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/authenticate", (req, res) => {
//   const { password } = req.body;

//   if (!password) {
//     return res.status(400).json({ error: "vyžadováno heslo" });
//   }
//   bcrypt.compare(
//     password,
//     process.env.UPLOAD_PASSWORD_HASHED,
//     (err, result) => {
//       if (err || !result) {
//         return res.status(401).json({ error: "Špatné heslo" });
//       }
//       // Password correct, return success
//       res.status(200).json({ message: "Uživatel autorizován" });
//     }
//   );
// });
app.get("/getUniqueValues", async (req, res) => {
  const { columnName } = req.query; // Use req.query to get query parameters
  try {
    const values = await extractValuesFromArrayColumn(
      columnName as string,
      true
    ); // Assuming extractValuesFromArrayColumn returns unique values
    res.json(values);
  } catch (error) {
    console.error("Error retrieving values:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/downloadExcel", async (req: Request, res: Response) => {
  try {
    const buffer = await fetchAndCreateExcel("knihy"); // Replace 'knihy' with your table name
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="stav_knih_na_serveru.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
    console.log("downloading excel");
  } catch (error) {
    console.error("Error generating or sending Excel file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/update", upload.single("file"), async (req, res) => {
  try {
    // Handle file upload with Multer
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Specify the file path
    const filePath = path.join(__dirname, "../", "knihy.xlsx"); // Adjust the path as needed

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    let { worksheet } = loadExcelSheet(filePath);
    // Apply data transformations
    worksheet = excelWordsToBool(worksheet, "available");
    worksheet = excelWordsToBool(worksheet, "formaturita");
    worksheet = fillMissingIds(worksheet);
    // Insert data into PostgreSQL
    await insertExcelDataToPostgres(filePath, "knihy"); // Assuming insertExcelDataToPostgres is async

    // Respond with success message
    res
      .status(200)
      .json({ message: "File processed and uploaded successfully" });
  } catch (error) {
    console.error("Error processing data:", error);

    // Determine the appropriate error response
    let errorMessage = "Internal Server Error";
    if (
      error.message === "No file uploaded" ||
      error.message.startsWith("File not found")
    ) {
      errorMessage = error.message;
    } else if (error.message === "Badly formatted row") {
      errorMessage = "Some rows in the file are badly formatted";
    } else if (
      error.message.startsWith("Error inserting data into PostgreSQL")
    ) {
      errorMessage = "Error inserting data into the database";
    }

    res.status(500).json({ error: errorMessage });
  }
});


// Public route (no token required)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username,password)
  if (username === 'admin' && password === process.env.JWT_SECRET) {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    res.cookie('authToken', token, { httpOnly: true, maxAge: 3600 * 1000 });
    return res.status(200).json({ message: 'Login successful', token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password,  password === process.env.JWT_SECRET);

//   if (username === 'admin' && password === process.env.JWT_SECRET) {
//     const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     console.log('passed');

//     // Set the cookie with the token
//     res.cookie('authToken', token, { httpOnly: true, maxAge: 3600 * 1000 });

//     return res.status(200).json({ message: 'Login successful', token });
//   }

//   return res.status(401).json({ message: 'Invalid credentials' });
// });
app.use((req, res) => {
  res.status(405).json({ message: 'Method not allowed' });
});


app.listen(port, () => {
console.log(process.env.NODE_ENV === 'production')
console.log('x')
  console.log(`Server is running on port ${port}`);
});