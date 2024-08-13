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
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const db_1 = require("./db");
const body_parser_1 = __importDefault(require("body-parser"));
const excelUtils_1 = require("./excelUtils");
const jose_1 = require("jose");
// make sure you run npx tsc -w before using this file
const cookieParser = require('cookie-parser');
// const verifyToken = require('./verifyToken'); // Path to your verifyToken middleware
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
    let sqlQuery = "SELECT DISTINCT ON (name) * FROM knihy";
    console.log('hello');
    debugger;
    if (!filters) {
        return res.status(400).json({ error: "Server didn't receive filters" });
    }
    if (page <= 0) {
        return res.status(400).json({ error: "page number was set to 0" });
    }
    const { whereClause, queryParams } = (0, db_1.buildFilterQuery)(filters);
    sqlQuery += ` ${whereClause} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    console.log(sqlQuery, page, limit);
    // Calculate offset
    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);
    try {
        const result = yield (0, db_1.query)(sqlQuery, queryParams);
        console.log(result.rows.length);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error executing search query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get("/uniqueNamesCount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sqlQuery = "SELECT COUNT(DISTINCT name) AS uniqueNamesCount FROM knihy";
    try {
        const result = yield (0, db_1.query)(sqlQuery);
        if (result.rows.length > 0) {
            // @ts-ignore
            res.json(result.rows[0].uniquenamescount);
        }
        else {
            res.status(404).json({ error: "No data found" });
        }
    }
    catch (error) {
        console.error("Error executing count query:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
// app.post("/authenticate", (req, res) => {
//   const { password } = req.body;
//   if (!password) {
//     return res.status(400).json({ error: "vyžadováno heslo" });
//   }
//   bcrypt.compare(
//     password,
//     process.env.UPLOAD_PASSWORD_HASHED,
//     (err, result) => {
//       if (err || !result) {
//         return res.status(401).json({ error: "Špatné heslo" });
//       }
//       // Password correct, return success
//       res.status(200).json({ message: "Uživatel autorizován" });
//     }
//   );
// });
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
        let { worksheet } = (0, excelUtils_1.loadExcelSheet)(filePath);
        // Apply data transformations
        worksheet = (0, excelUtils_1.excelWordsToBool)(worksheet, "available");
        worksheet = (0, excelUtils_1.excelWordsToBool)(worksheet, "formaturita");
        worksheet = (0, excelUtils_1.fillMissingIds)(worksheet);
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
// Public route (no token required)
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log(username, password);
    if (username === 'admin' && password === process.env.JWT_SECRET) {
        const token = yield new jose_1.SignJWT({ role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));
        res.cookie('authToken', token, { httpOnly: true, maxAge: 3600 * 1000 });
        return res.status(200).json({ message: 'Login successful', token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
}));
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password,  password === process.env.JWT_SECRET);
//   if (username === 'admin' && password === process.env.JWT_SECRET) {
//     const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     console.log('passed');
//     // Set the cookie with the token
//     res.cookie('authToken', token, { httpOnly: true, maxAge: 3600 * 1000 });
//     return res.status(200).json({ message: 'Login successful', token });
//   }
//   return res.status(401).json({ message: 'Invalid credentials' });
// });
app.use((req, res) => {
    res.status(405).json({ message: 'Method not allowed' });
});
app.listen(port, () => {
    console.log(process.env.NODE_ENV === 'production');
    console.log(`Server is running on port ${port}`);
});
