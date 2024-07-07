// make sure you run npx tsc -w before using this file
import express, { Request, Response } from "express";
import cors from "cors";
import xlsx from "xlsx";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  connectAndQuery,
  extractValuesFromArrayColumn,
  fetchAndCreateExcel,
  insertExcelDataToPostgres,
  query,
} from "./db";
// import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import { excelWordsToBool, fillMissingIds } from "./excelUtils";
import { Book, Filters } from "./types";
import { checkResultStartWithQuery, checkSearchRelevant, getSimilarity } from "./searchinUtils";
import { isFiltersType } from "./utils";
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
const checkIfIgnoredValue = (value:any) => {
  if (value === null || value === '' || value === false|| (Array.isArray(value) && value.length === 0)) {
    return true;
  }
}
/**
 * Builds a SQL filter query based on the provided filters.
 *
 * @param {Filters} filters - An object containing filter key-value pairs.
 * @returns {Object} An object containing the SQL WHERE clause and query parameters.
 */
const buildFilterQuery = (filters: Filters) => {
  const queryParams: any[] = [];
  const conditions: string[] = [];
  Object.keys(filters).forEach((key) => {
    const value = filters[key];

    if (checkIfIgnoredValue(value)) {
      return;
    }

    if (Array.isArray(value)) {
      if (key === 'genres') {  // Adjust these column names based on your schema
        // Assuming DB column is an array and filter is an array
        queryParams.push(value);
        conditions.push(`${key} && $${queryParams.length}::text[]`);
      } else {
        // Assuming DB column is a simple value and filter is an array
        queryParams.push(value);
        conditions.push(`${key} = ANY($${queryParams.length}::text[])`);
      }
    } else {
      // Assuming DB column is a simple value and filter is a simple value
      queryParams.push(value);
      conditions.push(`${key} = $${queryParams.length}`);
    }
  });

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, queryParams };
};

app.post('/bookList', async (req, res) => {
  const { filters } = req.body;
  let sqlQuery = defaultQuery;

  if (!filters) {
    return res.status(400).json({ error: "Server didn't receive filters" });
  }
  // console.log(1)
  const { whereClause, queryParams } = buildFilterQuery(filters);
  sqlQuery += ` ${whereClause}`;
  // console.log(sqlQuery, queryParams)

  console.log('SQL Query:', sqlQuery);
  console.log('Query Params:', queryParams);
  console.log('Filters:', filters);

  try {
    const result = await query(sqlQuery, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

app.get("/search", async (req: Request, res: Response) => {
  const { bookName, filters } = req.query;
  let sqlQuery = defaultQuery;
  console.log(filters,!isFiltersType(filters), typeof bookName !== 'string', bookName.trim()==='')
 if ( !isFiltersType(filters)|| typeof bookName !== 'string'|| bookName.trim()===''){
   return  res.status(400).json({ error: 'Bad Request' });
  }
  const { whereClause, queryParams } = buildFilterQuery(filters);
  sqlQuery += ` ${whereClause}`;
  console.log(bookName, filters)

  try {
    console.log(sqlQuery, queryParams)
    const result = await query(sqlQuery, queryParams);
    console.log(result.rows.length)
    const sanitizedResults = result.rows.map((value ) => {
      return value;
    });
    const filteredResults =  result //sanitizedResults.filter((result:Book) => {
    //   return (
    //     // checkSearchRelevant(result.keyword, query as string) ||
    //     checkResultStartWithQuery(result.name, bookName as string)
    //   );
    // });
    // console.log(filteredResults);
    // filteredResults.sort((a, b) => {
    //   return (
    //     getSimilarity(b.keyword, bookName as string) -
    //     getSimilarity(a.keyword, bookName as string)
    //   );
    // });
    res.json(filteredResults);
  } catch (error) {
    console.error("Error executing search query:", error);
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
