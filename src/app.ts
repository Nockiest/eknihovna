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
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import { excelWordsToBool, fillMissingIds } from "./excelUtils";
import { Book, Filters } from "./types";

// make sure you run npx tsc -w before using this file


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
  let sqlQuery = "SELECT DISTINCT name FROM knihy";

  if (!filters) {
    return res.status(400).json({ error: "Server didn't receive filters" });
  }
  if (page<=0) {
    return {}
  }
  const { whereClause, queryParams } = buildFilterQuery(filters);
  sqlQuery += ` ${whereClause} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  console.log(sqlQuery,page , limit  )
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

app.post("/authenticate", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "vyžadováno heslo" });
  }
  bcrypt.compare(password, process.env.UPLOAD_PASSWORD_HASHED, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: 'Špatné heslo' });
    }
  // Password correct, return success
    res.status(200).json({ message: 'Uživatel autorizován' });
  });
});
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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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

    // Read the uploaded file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];

    // Apply data transformations
    worksheet = excelWordsToBool(worksheet, "available");
    worksheet = excelWordsToBool(worksheet, "formaturita");
    worksheet = fillMissingIds(worksheet);
    console.log("x");
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
