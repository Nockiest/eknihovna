import * as xlsx from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import prisma from '@/app/lib/prisma';
import { truthyValues } from '@/data/values';

export const fillMissingIds = (worksheet: xlsx.WorkSheet): xlsx.WorkSheet => {
    // Get the range of the worksheet
    const range = xlsx.utils.decode_range(worksheet['!ref'] as string);

    // Find the ID column by looking for the header named 'id'
    const idCol = Object.keys(worksheet)
      .filter((key) => key[0] >= 'A' && key.slice(1) === '1')
      .find((key) => worksheet[key].v.toString().toLowerCase() === 'id');

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
  export function copyExcelFile(sourceFilePath: string, destFilePath: string): void {
    try {
      // Load the source Excel file
      const sourceWorkbook = xlsx.readFile(sourceFilePath);

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
      const {worksheet} = loadExcelSheet(url);
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
  export const excelWordsToBool = (worksheet: xlsx.WorkSheet, columnName: string): xlsx.WorkSheet => {
    // Convert the worksheet to JSON with rows as arrays
    let jsonData = xlsx.utils.sheet_to_json<any[]>(worksheet, {
      header: 1,
      defval: null,
    });

    // Define values considered as truthy
    // const truthyValues = ["yes", "true", true, 'dostupný', 1, "ano"];
    const header = jsonData[0] as string[]; // Header row
    const columnIndex = header.findIndex((col) => col.toLowerCase() === columnName.toLowerCase());

    if (columnIndex === -1) {
      // No matching column found, return the unchanged worksheet
      return worksheet;
    }

    // Update values in the specified column
    for (let i = 1; i < jsonData.length; i++) {
      const value = jsonData[i][columnIndex];

      if (typeof value === "string") {
        // Convert truthy values to "true" and others to "false"
        jsonData[i][columnIndex] = truthyValues.includes(value.toLowerCase()) ? "true" : "false";
      } else if (typeof value === "boolean") {
        // Normalize boolean values
        jsonData[i][columnIndex] = value ? "true" : "false";
      }
    }

    // Convert JSON data back to worksheet format
    worksheet = xlsx.utils.aoa_to_sheet(jsonData);
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


  export const fetchAndCreateExcel = async (
    tableName: string
  ): Promise<Buffer> => {
    try {
      // Fetch data using Prisma Client
      let data: any[];

      switch (tableName) {
        case 'knihy':
          data = await prisma.knihy.findMany();
          break;
        // Add cases for other table names if needed
        default:
          throw new Error(`Table ${tableName} is not supported`);
      }

      if (data.length === 0) {
        throw new Error("No data found in the table.");
      }

      // Convert Prisma query result to JSON
      const jsonData = data.map((item) => JSON.parse(JSON.stringify(item)));

      // Join array values into a string separated by commas
      jsonData.forEach((row: any) => {
        Object.keys(row).forEach((key) => {
          if (Array.isArray(row[key])) {
            row[key] = row[key].join(', ');
          }
        });
      });

      // Create a new workbook and worksheet
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(jsonData);

      // Append the worksheet to the workbook
      xlsx.utils.book_append_sheet(workbook, worksheet, tableName);

      // Write the workbook to a buffer
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return buffer;
    } catch (error) {
      console.error('Error fetching data or creating Excel file:', error);
      throw error;
    } finally {
      await prisma.$disconnect(); // Close the Prisma Client connection
    }
  };