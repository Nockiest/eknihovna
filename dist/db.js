"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValuesFromArrayColumn = exports.connectAndQuery = exports.fetchAndCreateExcel = exports.convertQueryResToJson = exports.insertExcelDataToPostgres = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const xlsx_1 = __importDefault(require("xlsx"));
const utils_1 = require("./utils");
dotenv_1.default.config();
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
exports.pool = new pg_1.Pool({
    user: "postgres",
    host: "localhost", // or your database host
    database: "eknihovna",
    password: process.env.PSQL_PASSWORD,
    port: 5432, // default PostgreSQL port
});
// Export a query function to execute SQL queries
const query = (text_1, ...args_1) => __awaiter(void 0, [text_1, ...args_1], void 0, function* (text, params = []) {
    const client = yield exports.pool.connect();
    try {
        const result = yield client.query(text, params);
        return result;
    }
    finally {
        client.release(); // Release the client back to the pool when done
    }
});
exports.query = query;
const insertExcelDataToPostgres = (filePath, tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read the Excel file
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx_1.default.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null,
        });
        // Extract headers and rows
        const [headers, ...rows] = jsonData;
        if (!headers || headers.length === 0) {
            throw new Error("The Excel file does not contain headers");
        }
        // Use the pool to get a client and execute the query
        const client = yield exports.pool.connect();
        try {
            // Get column types from the database
            const columnTypesQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = $1
      `;
            const columnTypesResult = yield client.query(columnTypesQuery, [
                tableName,
            ]);
            const columnTypes = columnTypesResult.rows.reduce((acc, { column_name, data_type }) => {
                acc[column_name] = data_type;
                return acc;
            }, {});
            for (const row of rows) {
                try {
                    // Check if row is well-formed
                    if (row.length !== headers.length) {
                        throw new Error(`Badly formatted row: ${JSON.stringify(row)}`);
                    }
                    // Process each cell value based on its column type
                    const processedRow = row.map((value, index) => {
                        const columnName = headers[index];
                        if (columnTypes[columnName] === "ARRAY" ||
                            columnTypes[columnName] === "text[]") {
                            return value
                                ? `{${value
                                    .split(",")
                                    .map((v) => `"${v.trim()}"`)
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
                    yield client.query(insertQuery, processedRow);
                }
                catch (rowError) {
                    console.error("Error processing row:", rowError.message);
                    // Throw error to stop further processing or log as needed
                    throw new Error(`Error processing row: ${rowError.message}`);
                }
            }
            console.log("Data successfully inserted or updated in PostgreSQL");
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error("Error inserting data into PostgreSQL:", error);
        throw new Error(`Error inserting data into PostgreSQL: ${error.message}`);
    }
});
exports.insertExcelDataToPostgres = insertExcelDataToPostgres;
function convertQueryResToJson(queryRes) {
    const res = queryRes.rows.map((row) => {
        // Convert boolean values to actual booleans instead of 'true'/'false'
        return Object.assign(Object.assign({}, row), { 
            // Example: Assuming 'active' is a boolean column
            available: row.available === "true" ? "ano" : "ne", formaturita: row.formaturita === "true" ? "ano" : "ne" });
    });
    return res;
}
exports.convertQueryResToJson = convertQueryResToJson;
const fetchAndCreateExcel = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query to select all entries from the specified table
        const queryResult = yield (0, exports.query)(`SELECT * FROM ${tableName}`);
        if (queryResult.rows.length === 0) {
            throw new Error("No data found in the table.");
        }
        // Convert the query result to JSON
        const jsonData = convertQueryResToJson(queryResult);
        // Join array values into a string separated by commas
        jsonData.forEach((row) => {
            Object.keys(row).forEach((key) => {
                if (Array.isArray(row[key])) {
                    row[key] = row[key].join(', ');
                }
            });
        });
        // Create a new workbook and worksheet
        const workbook = xlsx_1.default.utils.book_new();
        const worksheet = xlsx_1.default.utils.json_to_sheet(jsonData);
        // Append the worksheet to the workbook
        xlsx_1.default.utils.book_append_sheet(workbook, worksheet, tableName);
        // Write the workbook to a buffer
        const buffer = xlsx_1.default.write(workbook, { type: "buffer", bookType: "xlsx" });
        return buffer;
    }
    catch (error) {
        console.error("Error fetching data or creating Excel file:", error);
        throw error;
    }
});
exports.fetchAndCreateExcel = fetchAndCreateExcel;
function connectAndQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allEntriesQuery = "SELECT * FROM knihy";
            const queryResult = yield (0, exports.query)(allEntriesQuery);
            // Example query with parameters
            // const id = 1;
            // const queryResult = await query('SELECT * FROM knihy WHERE id = $1', [id]);
        }
        catch (error) {
            console.error("Error connecting to the database:", error);
        }
        finally {
            // The pool automatically manages connections, no need to manually close it
        }
    });
}
exports.connectAndQuery = connectAndQuery;
const extractValuesFromArrayColumn = (columnName_1, ...args_2) => __awaiter(void 0, [columnName_1, ...args_2], void 0, function* (columnName, unique = false, tableName = "knihy") {
    var _a;
    const client = yield exports.pool.connect();
    try {
        // Check if the column type is an array or can be treated as an array
        const columnTypeQuery = `
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = $1 AND column_name = $2
      `;
        const columnTypeResult = yield client.query(columnTypeQuery, [
            tableName,
            columnName,
        ]);
        const columnType = (_a = columnTypeResult.rows[0]) === null || _a === void 0 ? void 0 : _a.data_type;
        let values = [];
        if (columnType && columnType.includes("[]")) {
            // Column is an array type, unnest the array
            const query = `
          SELECT DISTINCT unnest(${columnName}) AS value
          FROM ${tableName}
        `;
            const result = yield client.query(query);
            // Extract the values from the result
            values = result.rows.map((row) => row.value);
        }
        else {
            // Column is not an array type, treat it as a single value per row
            const query = `
          SELECT DISTINCT ${columnName} AS value
          FROM ${tableName}
        `;
            const result = yield client.query(query);
            // Extract the values from the result
            values = result.rows.map((row) => row.value);
        }
        // Filter out null values
        values = values.filter((value) => value !== null);
        values = (0, utils_1.flattenIfArrayOfArrays)(values);
        return {
            columnName,
            values,
        };
    }
    catch (error) {
        console.error("Error extracting values:", error);
        return null;
    }
    finally {
        client.release();
    }
});
exports.extractValuesFromArrayColumn = extractValuesFromArrayColumn;
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
