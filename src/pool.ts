import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
let pool: Pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// if (process.env.NODE_ENV === 'PRODUCTION') {
//   pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
//   });
// } else {
//   pool = new Pool({
//     connectionString: "postgres://postgres:" + process.env.PSQL_PASSWORD + "@localhost:5432/eknihovna",
//   });
//   }

// pool =new Pool({
//   user: "postgres",
//   host: "localhost", // or your database host
//   database: "eknihovna",
//   password: process.env.PSQL_PASSWORD,
//   port: 5432, // default PostgreSQL port
// });

export { pool };
