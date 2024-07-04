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
// make sure you run npx tsc -w before using this file
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const xlsx_1 = __importDefault(require("xlsx"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("./db");
// import bcrypt from 'bcrypt';
const body_parser_1 = __importDefault(require("body-parser"));
const excelUtils_1 = require("./excelUtils");
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
const buildFilterQuery = (filters, filterKeys, sqlQuery) => {
    const checkColumnNameContainsArrays = (columnName) => {
        return (columnName === "genres" ||
            columnName === "category");
    };
    const isValidFilter = (value) => {
        return value !== null && !(Array.isArray(value) && value.length === 0);
    };
    console.log(1);
    const queryParams = [];
    const conditions = filterKeys.filter((key) => {
        const value = filters[key];
        console.log(isValidFilter(value), value);
        return isValidFilter(value);
    }) // Filter out keys with null values
        .map((key, index) => {
        const value = filters[key];
        console.log(checkColumnNameContainsArrays(key));
        if (!checkColumnNameContainsArrays(key)) {
            queryParams.push(value);
            return `${key} = $${queryParams.length}`;
        }
        // Assuming the value is an array
        const array = value;
        console.log(array);
        const valuesArray = array.map((v) => v.trim());
        console.log(valuesArray);
        queryParams.push(valuesArray);
        return `${key} = ANY($${queryParams.length}::varchar[])`;
    });
    console.log(2);
    if (conditions.length > 0) {
        sqlQuery += " WHERE " + conditions.join(" AND ");
    }
    return { sqlQuery, queryParams };
};
app.post("/bookList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filters } = req.body;
    let sqlQuery = "SELECT * FROM knihy";
    let queryParams = [];
    if (!filters) {
        res.status(400).json({ error: "Server didn't receive filters" });
    }
    const filterKeys = Object.keys(filters);
    if (filterKeys.length > 0) {
        console.log('building');
        const result = buildFilterQuery(filters, filterKeys, sqlQuery);
        sqlQuery = result.sqlQuery;
        queryParams = result.queryParams;
    }
    try {
        console.log(sqlQuery, queryParams);
        const result = yield (0, db_1.query)(sqlQuery, queryParams);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error executing search query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
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
app.post("/authenticate", (req, res) => {
    console.log("hello world x");
    const { password } = req.body;
    console.log(password, password.trim() === process.env.UPLOAD_PASSWORD);
    if (!password) {
        return res.status(400).json({ error: "vyžadováno heslo" });
    }
    if (password === process.env.UPLOAD_PASSWORD) {
        return res.status(200).json({ message: "Uživatel autorizován" });
    }
    else {
        return res.status(401).json({ error: "Špatné heslo" });
    }
    // bcrypt.compare(password, process.env.UPLOAD_PASSWORD_HASHED, (err, result) => {
    //   if (err || !result) {
    //     return res.status(401).json({ error: 'Špatné heslo' });
    //   }
    // Password correct, return success
    //   res.status(200).json({ message: 'Uživatel autorizován' });
    // });
});
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
