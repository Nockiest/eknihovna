import { Pool,   } from 'pg';
import dotenv from 'dotenv';
import xlsx from 'xlsx'
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

            // Check if the row already exists in the table
            const checkQuery = `
              SELECT 1 FROM ${tableName} WHERE ${headers.map((header, i) => `${header} = $${i + 1}`).join(' AND ')}
            `;
            const checkResult = await client.query(checkQuery, row);
            if (checkResult.rowCount === 0) {
              // Insert the row if it does not exist
              const insertQuery = `
                INSERT INTO ${tableName} (${headers.join(', ')})
                VALUES (${headers.map((_, i) => `$${i + 1}`).join(', ')})
              `;
              await client.query(insertQuery, row);
            }
          } catch (rowError) {
            console.error(rowError.message);
          }
        }
        console.log('Data successfully inserted into PostgreSQL');
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error inserting data into PostgreSQL:', error);
    }
  };
