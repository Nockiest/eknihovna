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
exports.buildFilterQuery = exports.checkIfIgnoredValue = exports.extractValuesFromArrayColumn = exports.connectAndQuery = exports.fetchAndCreateExcel = exports.convertQueryResToJson = exports.insertExcelDataToPostgres = exports.query = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const xlsx_1 = __importDefault(require("xlsx"));
const utils_1 = require("./utils");
const pool_1 = require("./pool");
const excelUtils_1 = require("./excelUtils");
dotenv_1.default.config();
const query = (text, params = []) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool_1.pool.connect();
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
        let { worksheet } = (0, excelUtils_1.loadExcelSheet)(filePath);
        worksheet = (0, excelUtils_1.fillMissingIds)(worksheet);
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
        const client = yield pool_1.pool.connect();
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
                    const processExcelRow = (row) => {
                        return row.map((value, index) => {
                            const columnName = headers[index];
                            const trimmedValue = typeof value === 'string' ? value.trim() : value;
                            if (columnTypes[columnName] === "ARRAY" ||
                                columnTypes[columnName] === "text[]") {
                                return trimmedValue
                                    ? `{${trimmedValue
                                        .split(",")
                                        .map((v) => `"${v.trim()}"`)
                                        .join(",")}}`
                                    : null;
                            }
                            return trimmedValue;
                        });
                    };
                    const insertRow = (row, headers) => __awaiter(void 0, void 0, void 0, function* () {
                        const insertQuery = `
            INSERT INTO ${tableName} (${headers.join(", ")})
            VALUES (${headers.map((_, i) => `$${i + 1}`).join(", ")})
            ON CONFLICT (id) DO UPDATE SET ${headers
                            .map((header, i) => `${header} = EXCLUDED.${header}`)
                            .join(", ")}
          `;
                        // Execute the query
                        yield client.query(insertQuery, processedRow);
                    });
                    // Process each cell value based on its column type and trim it
                    const processedRow = processExcelRow(row);
                    yield insertRow(processedRow, headers);
                    // Construct the insert query with ON CONFLICT to handle upserts
                    // const insertQuery = `
                    //   INSERT INTO ${tableName} (${headers.join(", ")})
                    //   VALUES (${headers.map((_, i) => `$${i + 1}`).join(", ")})
                    //   ON CONFLICT (id) DO UPDATE SET ${headers
                    //     .map((header, i) => `${header} = EXCLUDED.${header}`)
                    //     .join(", ")}
                    // `;
                    // // Execute the query
                    // await client.query(insertQuery, processedRow);
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
        return Object.assign(Object.assign({}, row), { available: row.available === "true" ? "ano" : "ne", formaturita: row.formaturita === "true" ? "ano" : "ne" });
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
const extractValuesFromArrayColumn = (columnName, unique = false, tableName = "knihy") => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const client = yield pool_1.pool.connect();
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
const checkIfIgnoredValue = (value) => {
    if (value === null ||
        value === "" ||
        value === false ||
        (Array.isArray(value) && value.length === 0)) {
        return true;
    }
};
exports.checkIfIgnoredValue = checkIfIgnoredValue;
/**
 * Builds a SQL filter query based on the provided filters.
 *
 * @param {Filters} filters - An object containing filter key-value pairs.
 * @returns {Object} An object containing the SQL WHERE clause and query parameters.
 */
const buildFilterQuery = (filters) => {
    const queryParams = [];
    const conditions = [];
    Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if ((0, exports.checkIfIgnoredValue)(value)) {
            return;
        }
        if (Array.isArray(value)) {
            if (key === "genres") {
                // Adjust these column names based on your schema
                // Assuming DB column is an array and filter is an array
                queryParams.push(value);
                conditions.push(`${key} && $${queryParams.length}::text[]`);
            }
            else {
                // Assuming DB column is a simple value and filter is an array
                queryParams.push(value);
                conditions.push(`${key} = ANY($${queryParams.length}::text[])`);
            }
        }
        else {
            // Assuming DB column is a simple value and filter is a simple value
            queryParams.push(value);
            conditions.push(`${key} = $${queryParams.length}`);
        }
    });
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    return { whereClause, queryParams };
};
exports.buildFilterQuery = buildFilterQuery;
