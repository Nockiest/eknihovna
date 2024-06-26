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
exports.saveExcelFile = exports.extractExcelWorksheet = exports.fillMissingIds = exports.excelWordsToBool = exports.readExcelFile = exports.copyExcelFile = exports.assignIds = void 0;
const db_1 = require("./db");
const fs_1 = __importDefault(require("fs"));
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const assignIds = (excelUrl, ignoreHeader = true, idColumn = 'A', numberOfRows = 10) => {
    // Load the Excel file
    const knihyURL = process.env.knihyURL;
    const workbook = xlsx.readFile(knihyURL);
    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];
    // Get the worksheet
    const worksheet = workbook.Sheets[sheetName];
    // Fill the specified column with UUIDs
    for (let i = ignoreHeader ? 2 : 1; i <= numberOfRows; i++) {
        const cellAddress = `A${i}`;
        worksheet[cellAddress] = { t: idColumn, v: uuidv4() };
    }
    // Write the updated workbook to a new file
    xlsx.writeFile(workbook, excelUrl);
    // Fill the specified column with UUIDs
    for (let i = ignoreHeader ? 2 : 1; i <= numberOfRows; i++) {
        const cellAddress = `A${i}`;
        worksheet[cellAddress] = { t: idColumn, v: uuidv4() };
    }
    // Write the updated workbook to a new file
    xlsx.writeFile(workbook, excelUrl);
};
exports.assignIds = assignIds;
/**
 * Copies all cells from a source Excel file to a destination Excel file.
 * @param {string} sourceFilePath - The path to the source Excel file.
 * @param {string} destFilePath - The path to the destination Excel file.
 */
function copyExcelFile(sourceFilePath, destFilePath) {
    try {
        // Read the source Excel file
        const sourceWorkbook = xlsx.readFile(sourceFilePath);
        // Create a new workbook for the destination file
        const destWorkbook = xlsx.utils.book_new();
        // Loop through each sheet in the source workbook
        sourceWorkbook.SheetNames.forEach(sheetName => {
            // Get the worksheet from the source workbook
            const worksheet = sourceWorkbook.Sheets[sheetName];
            // Add the worksheet to the destination workbook
            xlsx.utils.book_append_sheet(destWorkbook, worksheet, sheetName);
        });
        // Write the destination workbook to a file
        xlsx.writeFile(destWorkbook, destFilePath);
        console.log(`Data copied from ${sourceFilePath} to ${destFilePath}`);
    }
    catch (error) {
        console.error('Error copying Excel file:', error);
    }
}
exports.copyExcelFile = copyExcelFile;
const readExcelFile = (url) => {
    try {
        const workbook = xlsx.readFile(url);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        return data;
    }
    catch (error) {
        console.error('Error reading Excel file:', error);
    }
};
exports.readExcelFile = readExcelFile;
/**
 * Copies all cells from a source Excel file to a destination Excel file.
 * @param {string} worksheet - the Excel file
 * @param {string} columnName - The label of the column you want to change
 */
const excelWordsToBool = (worksheet, columnName) => {
    let jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });
    const truthyvalues = ['yes', 'true', true, 1, 'ano'];
    const header = jsonData[0];
    const columnIndex = header.findIndex(col => col === columnName);
    if (columnIndex === -1) {
        return worksheet; // No 'available' column found, return unchanged worksheet
    }
    // Update values in the 'available' column
    for (let i = 1; i < jsonData.length; i++) { // start from 1 to skip the header row
        const value = jsonData[i][columnIndex];
        if (typeof value === 'string') {
            // Convert 'yes' to true and 'no' to false
            jsonData[i][columnIndex] = truthyvalues.indexOf(value.toLowerCase()) >= 0 ? 'true' : 'false';
        }
        else if (typeof value === 'boolean') {
            // Normalize boolean values
            jsonData[i][columnIndex] = value;
        }
    }
    // Convert JSON data back to worksheet format
    worksheet = xlsx.utils.aoa_to_sheet(jsonData);
    return worksheet;
};
exports.excelWordsToBool = excelWordsToBool;
const fillMissingIds = (worksheet) => {
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    const idCol = Object.keys(worksheet)
        .filter((key) => key[0] >= 'A' && key[1] === '1')
        .find((key) => worksheet[key].v.toLowerCase() === 'id');
    if (!idCol) {
        throw new Error("No 'id' column found");
    }
    // Iterate over the rows starting from the second row
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const cellAddress = `${idCol[0]}${row + 1}`;
        if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { t: 's', v: uuidv4() };
        }
    }
    return worksheet;
};
exports.fillMissingIds = fillMissingIds;
const extractExcelWorksheet = (filePath, sheetnum = 0) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[sheetnum];
    let worksheet = workbook.Sheets[sheetName];
    return worksheet;
};
exports.extractExcelWorksheet = extractExcelWorksheet;
const saveExcelFile = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buffer = yield (0, db_1.fetchAndCreateExcel)('knihy');
        fs_1.default.writeFileSync('output.xlsx', buffer);
        console.log('Excel file created successfully.');
    }
    catch (error) {
        console.error('Error creating Excel file:', error);
    }
});
exports.saveExcelFile = saveExcelFile;
// // Convert JSON back to sheet
// const newWorksheet = xlsx.utils.aoa_to_sheet(jsonData);
// workbook.Sheets[sheetName] = newWorksheet;
// // Write the updated workbook to a new file
// const updatedFilePath = path.join(__dirname, 'uploads', `updated_${req.file.originalname}`);
// xlsx.writeFile(workbook, updatedFilePath);
// // Send response with the updated file path
// res.status(200).json({ message: 'Values processed and file updated successfully', filePath: updatedFilePath });
// // Clean up: Remove the uploaded file from the temporary storage
// fs.unlinkSync(filePath);
// } catch (error) {
// console.error('Error processing data:', error);
// res.status(500).json({ error: 'Internal Server Error' });
// }
// Example usage
// const sourceFilePath = 'path/to/source/file.xlsx';
// const destFilePath = 'path/to/dest/file.xlsx';
// copyExcelFile(sourceFilePath, destFilePath);
