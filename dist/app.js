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
        cb(null, '');
    },
    filename: (req, file, cb) => {
        cb(null, 'knihy.xlsx');
    }
});
const upload = (0, multer_1.default)({ storage });
// app.get('/bookList', async (req: Request, res: Response) => {
//   const { query } = req.query;
//   try {
//     const boookList = readExcelFile(knihyURL)
//     res.json(boookList);
//   } catch (error) {
//     console.error('Error executing search query:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
app.get('/bookList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query: searchQuery } = req.query;
    try {
        // Example query to fetch books filtered by  name containing the searchQuery
        const sqlQuery = `
      SELECT *
      FROM knihy
      WHERE name ILIKE $1
    `;
        const result = yield (0, db_1.query)(sqlQuery, [`%${searchQuery}%`]); // Using ILIKE for case-insensitive search
        res.json(result.rows); // Assuming result.rows contains books retrieved from the database
    }
    catch (error) {
        console.error('Error executing search query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/getGenres', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const columnName = 'genre'; // Replace with your actual array column name
    try {
        const values = yield (0, db_1.extractValuesFromArrayColumn)(columnName);
        res.json(values);
    }
    catch (error) {
        console.error('Error retrieving values:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.post('/authenticate', (req, res) => {
    const { password } = req.body;
    console.log(password);
    if (!password) {
        return res.status(400).json({ error: 'vyžadováno heslo' });
    }
    if (password === process.env.UPLOAD_PASSWORD) {
        res.status(200).json({ message: 'Uživatel autorizován' });
    }
    else {
        return res.status(401).json({ error: 'Špatné heslo' });
    }
    // bcrypt.compare(password, process.env.UPLOAD_PASSWORD_HASHED, (err, result) => {
    //   if (err || !result) {
    //     return res.status(401).json({ error: 'Špatné heslo' });
    //   }
    // Password correct, return success
    //   res.status(200).json({ message: 'Uživatel autorizován' });
    // });
});
app.get('/downloadExcel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buffer = yield (0, db_1.fetchAndCreateExcel)('knihy'); // Replace 'knihy' with your table name
        res.setHeader('Content-Disposition', 'attachment; filename="stav_knih_na_serveru.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
        console.log('downloading excel');
    }
    catch (error) {
        console.error('Error generating or sending Excel file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.post('/update', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handle file upload with Multer
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        // Specify the file path
        const filePath = path_1.default.join(__dirname, '../', 'knihy.xlsx'); // Adjust the path as needed
        // Check if the file exists
        if (!fs_1.default.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }
        // Read the uploaded file
        const workbook = xlsx_1.default.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[sheetName];
        // Apply data transformation
        worksheet = (0, excelUtils_1.excelWordsToBool)(worksheet, 'available');
        worksheet = (0, excelUtils_1.excelWordsToBool)(worksheet, 'formaturita');
        worksheet = (0, excelUtils_1.fillMissingIds)(worksheet);
        (0, db_1.insertExcelDataToPostgres)(filePath, 'knihy');
        // // remove this part asap!!!!!
        // workbook.Sheets[sheetName] = worksheet
        // xlsx.writeFile(workbook, filePath);
        // Respond with success message
        res.status(200).json({ message: 'File processed and uploaded successfully' });
    }
    catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// const mockData = {rows:[{"id":1,"name":"Bobea elatior Gaudich.","iban":"IE23 LSJW 9122 7020 8015 01","author":"Rog Enns","rating":80,"description":"vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi","forMaturita":true,"available":false},
//   {"id":2,"name":"Eriogonum codium Reveal, Caplow & K. Beck","iban":"GL85 1035 6131 3886 40","author":null,"rating":1,"description":"nec sem duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue","forMaturita":false,"available":true},
//   {"id":3,"name":"Desmodium styracifolium (Osbeck) Merr.","iban":"BH94 QPPX X51H 8OJR TC6D SP","author":"Joannes Jerrems","rating":35,"description":"nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat","forMaturita":true,"available":false},
//   {"id":4,"name":"Quercus minima (Sarg.) Small","iban":"FR10 0417 3188 751Z S8NC KNWT E32","author":"Katharina Wogden","rating":34,"description":"amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi","forMaturita":true,"available":false},
//   {"id":5,"name":"Lecidea pycnocarpa (Körb.) Ohlert","iban":"SK51 4094 2726 4235 3462 3223","author":"Court Coston","rating":73,"description":"augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi","forMaturita":true,"available":true},
//   {"id":6,"name":"Clarkia mildrediae (A. Heller) F.H. Lewis & M.E. Lewis ssp. lutescens Gottlieb & L.P. Janeway","iban":"AT68 1790 3618 6799 8438","author":"Roxanna Frugier","rating":74,"description":"etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate","forMaturita":null,"available":false},
//   {"id":7,"name":"Vicia hassei S. Watson","iban":"GE09 KU91 7754 3667 0534 54","author":"Rossy Kobpac","rating":96,"description":"et ultrices posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam id ornare imperdiet sapien urna pretium nisl ut volutpat sapien arcu","forMaturita":true,"available":false},
//   {"id":8,"name":"Epidendrum mutelianum Cogn.","iban":"LB64 2421 F4LF JOOZ EVZZ O1TD O84Q","author":"Rollins Vasilik","rating":88,"description":"rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa id lobortis convallis","forMaturita":true,"available":true},
//   {"id":9,"name":"Cryptantha mohavensis (Greene) Greene","iban":"CH65 2202 7FQA DRIA EWCF 8","author":null,"rating":23,"description":"facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat","forMaturita":true,"available":true},
//   {"id":10,"name":"Nicotiana L.","iban":"FR96 2717 6297 19FL NGQG LN84 097","author":"Malva MacConnal","rating":63,"description":"mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu nibh quisque id justo","forMaturita":false,"available":true},]}
//
// const pool = new Pool({
//   host: 'localhost',
//   user: 'postgres',
//   database: 'postgres',
//   password: 'OndPost06',
//   port: 5432,
// });
// type DbSearch = {
//   id: number;
//   keyword: string;
//   fullquery: string;
//   popularity: number;
// };
