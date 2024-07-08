import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";
import xlsx from "xlsx";
import fs from "fs";
import { flattenIfArrayOfArrays } from "./utils";
import { pool } from "./pool";
import { Filters } from "./types";
import {   loadExcelSheet } from "./excelUtils";
dotenv.config();

export const query = async (text, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release(); // Release the client back to the pool when done
  }
};

export const insertExcelDataToPostgres = async (
  filePath: string,
  tableName: string
): Promise<void> => {
  try {
    // Read the Excel file
    const { worksheet} = loadExcelSheet (filePath)
    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    });

    // Extract headers and rows
    const [headers, ...rows] = jsonData;

    if (!headers || headers.length === 0) {
      throw new Error("The Excel file does not contain headers");
    }

    // Use the pool to get a client and execute the query
    const client = await pool.connect();
    try {
      // Get column types from the database
      const columnTypesQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
      `;
      const columnTypesResult = await client.query(columnTypesQuery, [
        tableName,
      ]);
      const columnTypes = columnTypesResult.rows.reduce(
        (
          acc: any,
          { column_name, data_type }: { column_name: string; data_type: string }
        ) => {
          acc[column_name] = data_type;
          return acc;
        },
        {}
      );

      for (const row of rows) {
        try {
          // Check if row is well-formed
          if (row.length !== headers.length) {
            throw new Error(`Badly formatted row: ${JSON.stringify(row)}`);
          }

          // Process each cell value based on its column type and trim it
          const processedRow = row.map((value, index) => {
            const columnName = headers[index];
            const trimmedValue = typeof value === 'string' ? value.trim() : value;

            if (
              columnTypes[columnName] === "ARRAY" ||
              columnTypes[columnName] === "text[]"
            ) {
              return trimmedValue
                ? `{${trimmedValue
                    .split(",")
                    .map((v: string) => `"${v.trim()}"`)
                    .join(",")}}`
                : null;
            }
            return trimmedValue;
          });

          // Construct the insert query with ON CONFLICT to handle upserts
          const insertQuery = `
            INSERT INTO ${tableName} (${headers.join(", ")})
            VALUES (${headers.map((_, i) => `$${i + 1}`).join(", ")})
            ON CONFLICT (id) DO UPDATE SET ${headers
              .map((header, i) => `${header} = EXCLUDED.${header}`)
              .join(", ")}
          `;

          // Execute the query
          await client.query(insertQuery, processedRow);
        } catch (rowError) {
          console.error("Error processing row:", rowError.message);
          // Throw error to stop further processing or log as needed
          throw new Error(`Error processing row: ${rowError.message}`);
        }
      }
      console.log("Data successfully inserted or updated in PostgreSQL");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw new Error(`Error inserting data into PostgreSQL: ${error.message}`);
  }
};


export function convertQueryResToJson(queryRes) {
  const res = queryRes.rows.map((row) => {
    // Convert boolean values to actual booleans instead of 'true'/'false'
    return {
      ...row,
      available: row.available === "true" ? "ano" : "ne", // Convert 'true'/'false' strings to actual booleans
      formaturita: row.formaturita === "true" ? "ano" : "ne", // Convert 'true'/'false' strings to actual booleans
    };
  });
  return res;
}

export const fetchAndCreateExcel = async (
  tableName: string
): Promise<Buffer> => {
  try {
    // Query to select all entries from the specified table
    const queryResult = await query(`SELECT * FROM ${tableName}`);

    if (queryResult.rows.length === 0) {
      throw new Error("No data found in the table.");
    }

    // Convert the query result to JSON
    const jsonData = convertQueryResToJson(queryResult);

    // Join array values into a string separated by commas
    jsonData.forEach((row: any) => {
      Object.keys(row).forEach((key) => {
        if (Array.isArray(row[key])) {
          row[key] = row[key].join(', ');
        }
      });
    });

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, tableName);

    // Write the workbook to a buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    return buffer;
  } catch (error) {
    console.error("Error fetching data or creating Excel file:", error);
    throw error;
  }
};

export async function connectAndQuery() {
  try {
    const allEntriesQuery = "SELECT * FROM knihy";
    const queryResult = await query(allEntriesQuery);
    // Example query with parameters
    // const id = 1;
    // const queryResult = await query('SELECT * FROM knihy WHERE id = $1', [id]);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // The pool automatically manages connections, no need to manually close it
  }
}
interface ExtractedValues {
  columnName: string;
  values: any[];
}
export const extractValuesFromArrayColumn = async (
  columnName: string,
  unique: boolean = false,
  tableName: string = "knihy"
): Promise<ExtractedValues | null> => {
  const client: PoolClient = await pool.connect();

  try {
    // Check if the column type is an array or can be treated as an array
    const columnTypeQuery = `
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = $1 AND column_name = $2
      `;
    const columnTypeResult = await client.query(columnTypeQuery, [
      tableName,
      columnName,
    ]);
    const columnType = columnTypeResult.rows[0]?.data_type;

    let values: string[] = [];

    if (columnType && columnType.includes("[]")) {
      // Column is an array type, unnest the array
      const query = `
          SELECT DISTINCT unnest(${columnName}) AS value
          FROM ${tableName}
        `;
      const result = await client.query(query);

      // Extract the values from the result
      values = result.rows.map((row) => row.value);
    } else {
      // Column is not an array type, treat it as a single value per row
      const query = `
          SELECT DISTINCT ${columnName} AS value
          FROM ${tableName}
        `;
      const result = await client.query(query);

      // Extract the values from the result
      values = result.rows.map((row) => row.value);
    }

    // Filter out null values
    values = values.filter((value) => value !== null);
    values = flattenIfArrayOfArrays(values);
    return {
      columnName,
      values,
    };
  } catch (error) {
    console.error("Error extracting values:", error);
    return null;
  } finally {
    client.release();
  }
};


export const checkIfIgnoredValue = (value: any) => {
  if (
    value === null ||
    value === "" ||
    value === false ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return true;
  }
};
/**
 * Builds a SQL filter query based on the provided filters.
 *
 * @param {Filters} filters - An object containing filter key-value pairs.
 * @returns {Object} An object containing the SQL WHERE clause and query parameters.
 */
export const buildFilterQuery = (filters: Filters) => {
  const queryParams: any[] = [];
  const conditions: string[] = [];
  Object.keys(filters).forEach((key) => {
    const value = filters[key];

    if (checkIfIgnoredValue(value)) {
      return;
    }

    if (Array.isArray(value)) {
      if (key === "genres") {
        // Adjust these column names based on your schema
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

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereClause, queryParams };
};
