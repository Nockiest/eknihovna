import { knihyURL, testURL } from "./data";

const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');

export const assignIds = (excelUrl: string, ignoreHeader: boolean = true, idColumn: string = 'A', numberOfRows:number =10) => {
    // Load the Excel file
    const workbook = xlsx.readFile(knihyURL);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get the worksheet
    const worksheet = workbook.Sheets[sheetName];

    // Fill the specified column with UUIDs
    for (let i = ignoreHeader? 2: 1; i <= numberOfRows; i++) {
        const cellAddress = `A${i}`;
        worksheet[cellAddress] = { t: idColumn, v: uuidv4() };
    }

    // Write the updated workbook to a new file
    xlsx.writeFile(workbook, excelUrl);

// Fill the specified column with UUIDs
for (let i = ignoreHeader? 2: 1; i <= numberOfRows; i++) {
    const cellAddress = `A${i}`;
    worksheet[cellAddress] = { t: idColumn, v: uuidv4() };
}

// Write the updated workbook to a new file
xlsx.writeFile(workbook, excelUrl);

}