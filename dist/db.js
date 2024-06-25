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
exports.connectAndQuery = exports.saveExcelFile = exports.fetchAndCreateExcel = exports.insertExcelDataToPostgres = exports.query = exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
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
                    // Construct the insert query with ON CONFLICT to handle upserts
                    const insertQuery = `
            INSERT INTO ${tableName} (${headers.join(', ')})
            VALUES (${headers.map((_, i) => `$${i + 1}`).join(', ')})
            ON CONFLICT (id) DO UPDATE SET ${headers.map((header, i) => `${header} = EXCLUDED.${header}`).join(', ')}
          `;
                    // Execute the query
                    yield client.query(insertQuery, row);
                }
                catch (rowError) {
                    console.error(rowError.message);
                }
            }
            console.log('Data successfully inserted or updated in PostgreSQL');
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
const fetchAndCreateExcel = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query to select all entries from the specified table
        const queryResult = yield (0, exports.query)(`SELECT * FROM ${tableName}`);
        if (queryResult.rows.length === 0) {
            throw new Error('No data found in the table.');
        }
        // Convert the query result to JSON
        const jsonData = queryResult.rows.map(row => {
            // Convert boolean values to actual booleans instead of 'true'/'false'
            return Object.assign(Object.assign({}, row), { 
                // Example: Assuming 'active' is a boolean column
                available: row.available === 'true' ? "ano" : "ne", formaturita: row.formaturita === 'true' ? "ano" : "ne" // Convert 'true'/'false' strings to actual booleans
             });
        });
        // Create a new workbook and worksheet
        const workbook = xlsx_1.default.utils.book_new();
        const worksheet = xlsx_1.default.utils.json_to_sheet(jsonData);
        // Append the worksheet to the workbook
        xlsx_1.default.utils.book_append_sheet(workbook, worksheet, tableName);
        // Write the workbook to a buffer
        const buffer = xlsx_1.default.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
    catch (error) {
        console.error('Error fetching data or creating Excel file:', error);
        throw error;
    }
});
exports.fetchAndCreateExcel = fetchAndCreateExcel;
// Example usage
const saveExcelFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buffer = yield (0, exports.fetchAndCreateExcel)('knihy');
        fs_1.default.writeFileSync('output.xlsx', buffer);
        console.log('Excel file created successfully.');
    }
    catch (error) {
        console.error('Error creating Excel file:', error);
    }
});
exports.saveExcelFile = saveExcelFile;
function connectAndQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to the database and execute queries
            yield (0, exports.query)('SELECT NOW()', []);
            console.log('Connected to the database successfully.');
            const allEntriesQuery = 'SELECT * FROM knihy';
            const queryResult = yield (0, exports.query)(allEntriesQuery);
            // Example query with parameters
            // const id = 1;
            // const queryResult = await query('SELECT * FROM knihy WHERE id = $1', [id]);
            console.log('Query result:', queryResult.rows);
        }
        catch (error) {
            console.error('Error connecting to the database:', error);
        }
        finally {
            // The pool automatically manages connections, no need to manually close it
        }
    });
}
exports.connectAndQuery = connectAndQuery;
