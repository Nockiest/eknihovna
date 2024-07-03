import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";
import xlsx from "xlsx";
import fs from "fs";
import { flattenIfArrayOfArrays } from "./utils";
dotenv.config();
// Create a new Pool instance (recommended for handling multiple connections)
// export const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   user: process.env.DB_USER,
//   password: process.env.PSQL_PASSWORD,
//   database: process.env.DB_NAME,
// });
// export const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// })
export const pool = new Pool({
  user: "postgres",
  host: "localhost", // or your database host
  database: "eknihovna",
  password: process.env.PSQL_PASSWORD,
  port: 5432, // default PostgreSQL port
});
// Export a query function to execute SQL queries

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
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
    const worksheet = workbook.Sheets[sheetName];
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

          // Process each cell value based on its column type
          const processedRow = row.map((value, index) => {
            const columnName = headers[index];
            if (
              columnTypes[columnName] === "ARRAY" ||
              columnTypes[columnName] === "text[]"
            ) {
              return value
                ? `{${value
                    .split(",")
                    .map((v: string) => `"${v.trim()}"`)
                    .join(",")}}`
                : null;
            }
            return value;
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
      // Example: Assuming 'active' is a boolean column
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

// export const extractValuesFromArrayColumn = async (
//   columnName: string,
//   unique: boolean = false, // Default to false, meaning non-unique by default

//   tableName: string = 'knihy',
// ): Promise<ExtractedValues | null> => {
//   const client: PoolClient = await pool.connect();
//   try {
//     const query = `
//       SELECT unnest(${columnName}) AS ${columnName}
//       FROM ${tableName}
//     `;
//     const result = await client.query(query);

//     // Extract the values from the result
//     let values = result.rows.map((row) => row[columnName]); // Assuming columnName is correctly set

//     // If unique is true, filter the values to only include unique values
//     if (unique) {
//       values = Array.from(new Set(values));
//     }

//     values.forEach((value, index) => {
//       console.log(`Value ${index + 1}:`, value);
//     });
//     console.log(result.rows);
//     return {
//       columnName,
//       values,
//     };
//   } catch (error) {
//     console.error('Error extracting values:', error);
//     return null;
//   } finally {
//     client.release();
//   }
// };
