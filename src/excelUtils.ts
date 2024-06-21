
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');

export const assignIds = (excelUrl: string, ignoreHeader: boolean = true, idColumn: string = 'A', numberOfRows:number =10) => {
    // Load the Excel file
    const knihyURL = process.env.knihyURL
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
  } catch (error) {
    console.error('Error copying Excel file:', error);
  }
}

// Example usage
// const sourceFilePath = 'path/to/source/file.xlsx';
// const destFilePath = 'path/to/dest/file.xlsx';
// copyExcelFile(sourceFilePath, destFilePath);
