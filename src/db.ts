import { Pool,   } from 'pg';
import dotenv from 'dotenv';
import xlsx from 'xlsx'
import fs from 'fs'
dotenv.config();
// Create a new Pool instance (recommended for handling multiple connections)
export const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // or your database host
  database: 'eknihovna',
  password: process.env.PSQL_PASSWORD,
  port: 5432, // default PostgreSQL port
});

// Export a query function to execute SQL queries
export const query = async (text, params) => {
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
    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

    // Extract headers and rows
    const [headers, ...rows] = jsonData;

    if (!headers || headers.length === 0) {
      throw new Error('The Excel file does not contain headers');
    }

    // Use the pool to get a client and execute the query
    const client = await pool.connect();
    try {
      for (const row of rows) {
        try {
          // Check if row is well-formed
          if (row.length !== headers.length) {
            throw new Error(`Badly formatted row: ${JSON.stringify(row)}`);
          }

          // Construct the insert query with ON CONFLICT to handle upserts
          const insertQuery = `
            INSERT INTO ${tableName} (${headers.join(', ')})
            VALUES (${headers.map((_, i) => `$${i + 1}`).join(', ')})
            ON CONFLICT (id) DO UPDATE SET ${headers.map((header, i) => `${header} = EXCLUDED.${header}`).join(', ')}
          `;

          // Execute the query
          await client.query(insertQuery, row);
        } catch (rowError) {
          console.error(rowError.message);
        }
      }
      console.log('Data successfully inserted or updated in PostgreSQL');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error inserting data into PostgreSQL:', error);
  }
};

export const fetchAndCreateExcel = async (tableName: string): Promise<Buffer> => {
  try {
    // Query to select all entries from the specified table
    const queryResult = await query(`SELECT * FROM ${tableName}`);

    if (queryResult.rows.length === 0) {
      throw new Error('No data found in the table.');
    }

    // Convert the query result to JSON
    const jsonData = queryResult.rows.map(row => {
      // Convert boolean values to actual booleans instead of 'true'/'false'
      return {
        ...row,
        // Example: Assuming 'active' is a boolean column
        available: row.available === 'true'? "ano":"ne"  ,// Convert 'true'/'false' strings to actual booleans
        formaturita: row.formaturita === 'true'?"ano":"ne"   // Convert 'true'/'false' strings to actual booleans
      };
    });

    // Create a new workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jsonData);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, tableName);

    // Write the workbook to a buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return buffer;
  } catch (error) {
    console.error('Error fetching data or creating Excel file:', error);
    throw error;
  }
};

  // Example usage
 export  const saveExcelFile = async () => {
    try {
      const buffer = await fetchAndCreateExcel('knihy');
      fs.writeFileSync('output.xlsx', buffer);
      console.log('Excel file created successfully.');
    } catch (error) {
      console.error('Error creating Excel file:', error);
    }
  };

export async function connectAndQuery() {
    try {
      // Connect to the database and execute queries
      await query('SELECT NOW()', []);
      console.log('Connected to the database successfully.');

      const allEntriesQuery = 'SELECT * FROM knihy';
      const queryResult = await query(allEntriesQuery);
      // Example query with parameters
      // const id = 1;
      // const queryResult = await query('SELECT * FROM knihy WHERE id = $1', [id]);
      console.log('Query result:', queryResult.rows);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } finally {
      // The pool automatically manages connections, no need to manually close it
    }
  }
