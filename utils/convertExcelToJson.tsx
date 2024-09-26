import downloadExcelAsArrayBuffer from "./downloadExcelAsArrayBuffer";
import * as xlsx from "xlsx";
const convertExcelToJson = (arrayBuffer: ArrayBuffer): any[] => {
    try {
      // Convert the ArrayBuffer to a workbook
      const workbook = xlsx.read(arrayBuffer, { type: "array" });

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

      // Map the array to an array of objects
      const resultArray = (jsonData as any[][]).map((row: any[]) => {
        const obj: { [key: string]: any } = {}; // Define the object type
        for (let i = 0; i < (jsonData[0] as any[]).length; i++) {
          obj[(jsonData[0] as any[])[i]] = row[i];
        }
        return obj;
      });

      return resultArray.slice(1); // Return the data without headers
    } catch (error) {
      console.error("Error converting Excel to JSON:", error);
      throw error;
    }
  };
  export default convertExcelToJson