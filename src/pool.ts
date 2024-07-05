import { Pool } from 'pg';
import dotenv from "dotenv";
dotenv.config();
let pool: Pool;
// console.log(process.env.NODE_ENV === 'production')
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  pool =new Pool({
    user: "postgres",
    host: "localhost", // or your database host
    database: "eknihovna",
    password: process.env.PSQL_PASSWORD,
    port: 5432, // default PostgreSQL port
  });
}

export { pool };