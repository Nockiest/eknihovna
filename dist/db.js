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
exports.insertExcelDataToPostgres = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const xlsx_1 = __importDefault(require("xlsx"));
dotenv_1.default.config();
// Create a new Pool instance (recommended for handling multiple connections)
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost', // or your database host
    database: 'eknihovna',
    password: process.env.PSQL_PASSWORD,
    port: 5432, // default PostgreSQL port
});
// Export a query function to execute SQL queries
const query = (text, params) => __awaiter(void 0, void 0, void 0, function* () {
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
        const jsonData = xlsx_1.default.utils.sheet_to_json(worksheet, { header: 1, defval: null });
        // Extract headers and rows
        const [headers, ...rows] = jsonData;
        if (!headers || headers.length === 0) {
            throw new Error('The Excel file does not contain headers');
        }
        // Use the pool to get a client and execute the query
        const client = yield exports.pool.connect();
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
                    const checkResult = yield client.query(checkQuery, row);
                    if (checkResult.rowCount === 0) {
                        // Insert the row if it does not exist
                        const insertQuery = `
                INSERT INTO ${tableName} (${headers.join(', ')})
                VALUES (${headers.map((_, i) => `$${i + 1}`).join(', ')})
              `;
                        yield client.query(insertQuery, row);
                    }
                }
                catch (rowError) {
                    console.error(rowError.message);
                }
            }
            console.log('Data successfully inserted into PostgreSQL');
        }
        finally {
            client.release();
        }
    }
    catch (error) {
        console.error('Error inserting data into PostgreSQL:', error);
    }
});
exports.insertExcelDataToPostgres = insertExcelDataToPostgres;
