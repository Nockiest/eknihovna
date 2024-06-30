// make sure you run npx tsc -w before using this file
import express, { Request, Response } from "express";
import cors from "cors";
import xlsx from "xlsx";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
// import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import {
  excelWordsToBool,
  extractUniqueGenres,
  fillMissingIds,
  readExcelFile,
} from "./excelUtils";
import { v4 as uuidv4 } from "uuid";
import { Filters } from "./types";
// Load environment variables from .env file
dotenv.config();
const knihyURL = process.env.KNIHY_URL;
const port = 3002;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
  filename: (req, file, cb) => {
    cb(null, "knihy.xlsx");
  },
});

const upload = multer({ storage });
app.post("/bookList", async (req: Request, res: Response) => {
  const { filters }: { filters: Filters } = req.body;
  console.log(filters);

  try {
    const bookList = readExcelFile(knihyURL, ["genres"], filters);
    console.log(1, bookList);
    res.json(bookList);
  } catch (error) {
    console.error("Error executing search query:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/authenticate", (req, res) => {
  const { password } = req.body;
  console.log(password);

  if (!password) {
    return res.status(400).json({ error: "vyžadováno heslo" });
  }

  if (password === process.env.UPLOAD_PASSWORD) {
    res.status(200).json({ message: "Uživatel autorizován" });
  } else {
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

app.get("/downloadExcel", async (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../", knihyURL);
  console.log("File path:", filePath);

  if (fs.existsSync(filePath)) {
    res.download(filePath, "stav knih na serveru.xlsx", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

app.get("/getGenres", async (req: Request, res: Response) => {
  try {
    const bookList = readExcelFile(knihyURL, ["genres"], {});
    res.json(extractUniqueGenres(bookList));
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Server Error fetching genres: " });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // assignIds(knihyURL, true, 'A',   3530)
});

app.post("/update", upload.single("file"), async (req, res) => {
  try {
    // Handle file upload with Multer
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Specify the file path
    const filePath = path.join(__dirname, "../", "knihy.xlsx"); // Adjust the path as needed

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Read the uploaded file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[sheetName];

    // Apply data transformation
    worksheet = excelWordsToBool(worksheet, "available");
    worksheet = excelWordsToBool(worksheet, "formaturita");
    worksheet = fillMissingIds(worksheet);

    workbook.Sheets[sheetName] = worksheet;
    // Write the modified workbook back to file
    xlsx.writeFile(workbook, filePath);

    // Respond with success message
    res
      .status(200)
      .json({ message: "File processed and uploaded successfully" });
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// function modifyWorksheet(worksheet) {
//   // Example: Convert all 'available' values to boolean
//   const range = xlsx.utils.decode_range(worksheet['!ref']);
//   for (let row = range.s.r + 1; row <= range.e.r; row++) {
//     const cellAddress = `available${row + 1}`;
//     if (worksheet[cellAddress]) {
//       worksheet[cellAddress].v = worksheet[cellAddress].v.toLowerCase() === 'yes';
//     }
//   }
//   return worksheet;
// }
// app.post('/update', async (req, res) => {
//   try {
//     await upload.single('file')(req, res, (err) => {
//       if (err) {
//         console.error('Error uploading file:', err);
//         throw new Error('File upload failed');
//       }
//       res.status(200).json('sucess')
//       // Continue processing
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

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
