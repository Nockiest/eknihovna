"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignIds = void 0;
const data_1 = require("./data");
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const assignIds = (excelUrl, ignoreHeader = true, idColumn = 'A', numberOfRows = 10) => {
    // Load the Excel file
    const workbook = xlsx.readFile(data_1.knihyURL);
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
