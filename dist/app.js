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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const xlsx_1 = __importDefault(require("xlsx"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const body_parser_1 = __importDefault(require("body-parser"));
const excelUtils_1 = require("./excelUtils");
// make sure you run npx tsc -w before using this file
dotenv_1.default.config();
const knihyURL = process.env.KNIHY_URL;
const port = 3002;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "");
    },
    filename: (req, file, cb) => {
        cb(null, "knihy.xlsx");
    },
});
const upload = (0, multer_1.default)({ storage });
const defaultQuery = "SELECT * FROM knihy";
app.post("/bookList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filters, page = 1, limit = 10 } = req.body;
    let sqlQuery = "SELECT DISTINCT name FROM knihy";
    if (!filters) {
        return res.status(400).json({ error: "Server didn't receive filters" });
    }
    const { whereClause, queryParams } = (0, db_1.buildFilterQuery)(filters);
    sqlQuery += ` ${whereClause} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    console.log(sqlQuery);
    // Calculate offset
    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);
    try {
        const result = yield (0, db_1.query)(sqlQuery, queryParams);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error executing search query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// app.post("/bookList", async (req, res) => {
//   const { filters } = req.body;
//   let sqlQuery = "SELECT DISTINCT name FROM knihy";
//   if (!filters) {
//     return res.status(400).json({ error: "Server didn't receive filters" });
//   }
//   const { whereClause, queryParams } = buildFilterQuery(filters);
//   sqlQuery += ` ${whereClause}`;
//   // console.log("SQL Query:", sqlQuery);
//   // console.log("Query Params:", queryParams);
//   // console.log("Filters:", filters);
//   try {
//     const result = await query(sqlQuery, queryParams);
//     res.json(result.rows);
//   } catch (error) {
//     console.error("Error executing search query:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
app.post("/authenticate", (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: "vyžadováno heslo" });
    }
    bcrypt_1.default.compare(password, process.env.UPLOAD_PASSWORD_HASHED, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ error: 'Špatné heslo' });
        }
        // Password correct, return success
        res.status(200).json({ message: 'Uživatel autorizován' });
    });
});
app.get("/getUniqueValues", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { columnName } = req.query; // Use req.query to get query parameters
    try {
        const values = yield (0, db_1.extractValuesFromArrayColumn)(columnName, true); // Assuming extractValuesFromArrayColumn returns unique values
        res.json(values);
    }
    catch (error) {
        console.error("Error retrieving values:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get("/downloadExcel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buffer = yield (0, db_1.fetchAndCreateExcel)("knihy"); // Replace 'knihy' with your table name
        res.setHeader("Content-Disposition", 'attachment; filename="stav_knih_na_serveru.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);
        console.log("downloading excel");
    }
    catch (error) {
        console.error("Error generating or sending Excel file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.post("/update", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handle file upload with Multer
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        // Specify the file path
        const filePath = path_1.default.join(__dirname, "../", "knihy.xlsx"); // Adjust the path as needed
        // Check if the file exists
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }
        // Read the uploaded file
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[sheetName];
        // Apply data transformations
        worksheet = (0, excelUtils_1.excelWordsToBool)(worksheet, "available");
        worksheet = (0, excelUtils_1.excelWordsToBool)(worksheet, "formaturita");
        worksheet = (0, excelUtils_1.fillMissingIds)(worksheet);
        console.log("x");
        // Insert data into PostgreSQL
        yield (0, db_1.insertExcelDataToPostgres)(filePath, "knihy"); // Assuming insertExcelDataToPostgres is async
        // Respond with success message
        res
            .status(200)
            .json({ message: "File processed and uploaded successfully" });
    }
    catch (error) {
        console.error("Error processing data:", error);
        // Determine the appropriate error response
        let errorMessage = "Internal Server Error";
        if (error.message === "No file uploaded" ||
            error.message.startsWith("File not found")) {
            errorMessage = error.message;
        }
        else if (error.message === "Badly formatted row") {
            errorMessage = "Some rows in the file are badly formatted";
        }
        else if (error.message.startsWith("Error inserting data into PostgreSQL")) {
            errorMessage = "Error inserting data into the database";
        }
        res.status(500).json({ error: errorMessage });
    }
}));
