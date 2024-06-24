import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
// Create a new Pool instance (recommended for handling multiple connections)
const pool = new Pool({
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