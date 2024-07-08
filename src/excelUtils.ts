import { fetchAndCreateExcel } from "./db";
import fs from "fs";
const xlsx = require("xlsx");
const { v4: uuidv4 } = require("uuid");

export const loadExcelSheet = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];
  return { workbook, sheetName, worksheet };
}

/**
 * Copies all cells from a source Excel file to a destination Excel file.
 * @param {string} sourceFilePath - The path to the source Excel file.
 * @param {string} destFilePath - The path to the destination Excel file.
 */
export function copyExcelFile(sourceFilePath, destFilePath) {
  try {
    // Read the source Excel file
    const {workbook:sourceWorkbook} = loadExcelSheet(sourceFilePath )

    // Create a new workbook for the destination file
    const destWorkbook = xlsx.utils.book_new();

    // Loop through each sheet in the source workbook
    sourceWorkbook.SheetNames.forEach((sheetName) => {
      // Get the worksheet from the source workbook
      const worksheet = sourceWorkbook.Sheets[sheetName];

      // Add the worksheet to the destination workbook
      xlsx.utils.book_append_sheet(destWorkbook, worksheet, sheetName);
    });

    // Write the destination workbook to a file
    xlsx.writeFile(destWorkbook, destFilePath);

    console.log(`Data copied from ${sourceFilePath} to ${destFilePath}`);
  } catch (error) {
    console.error("Error copying Excel file:", error);
  }
}

export const readExcelFile = (url: string) => {
  try {
    const {workbook,sheetName, worksheet} = loadExcelSheet(url);
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error("Error reading Excel file:", error);
  }
};

/**
 * Copies all cells from a source Excel file to a destination Excel file.
 * @param {string} worksheet - the Excel file
 * @param {string} columnName - The label of the column you want to change
 */
export const excelWordsToBool = (worksheet, columnName) => {
  let jsonData = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
  });
  const truthyvalues = ["yes", "true", true,'dostupný', 1, "ano"];
  const header = jsonData[0];
  const columnIndex = header.findIndex((col) => col === columnName);

  if (columnIndex === -1) {
    return worksheet; // No 'available' column found, return unchanged worksheet
  }

  // Update values in the 'available' column
  for (let i = 1; i < jsonData.length; i++) {
    // start from 1 to skip the header row
    const value = jsonData[i][columnIndex];
    if (typeof value === "string") {
      // Convert 'yes' to true and 'no' to false
      jsonData[i][columnIndex] =
        truthyvalues.indexOf(value.toLowerCase()) >= 0 ? "true" : "false";
    } else if (typeof value === "boolean") {
      // Normalize boolean values
      jsonData[i][columnIndex] = value;
    }
  }
  // Convert JSON data back to worksheet format
  worksheet = xlsx.utils.aoa_to_sheet(jsonData);
  return worksheet;
};

export const fillMissingIds = (worksheet) => {
  const range = xlsx.utils.decode_range(worksheet["!ref"]);
  const idCol = Object.keys(worksheet)
    .filter((key) => key[0] >= "A" && key[1] === "1")
    .find((key) => worksheet[key].v.toLowerCase() === "id");

  if (!idCol) {
    throw new Error("No 'id' column found");
  }

  // Iterate over the rows starting from the second row
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const cellAddress = `${idCol[0]}${row + 1}`;
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { t: "s", v: uuidv4() };
    }
  }
  return worksheet;
};

export const extractExcelWorksheet = (
  filePath: string,
  sheetnum: number = 0
) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[sheetnum];
  let worksheet = workbook.Sheets[sheetName];
  return worksheet;
};

export const saveExcelFile = async () => {
  try {
    const buffer = await fetchAndCreateExcel("knihy");
    fs.writeFileSync("output.xlsx", buffer);
    console.log("Excel file created successfully.");
  } catch (error) {
    console.error("Error creating Excel file:", error);
  }
};