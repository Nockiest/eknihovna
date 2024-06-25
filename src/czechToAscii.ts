import fs from 'fs';
import xlsx from 'xlsx';

// Mapping of Czech characters to their ASCII equivalents
const czechToAscii: { [key: string]: string } = {
  'ě': 'e', 'š': 's', 'č': 'c', 'ř': 'r', 'ž': 'z',
  'ý': 'y', 'á': 'a', 'í': 'i', 'é': 'e', 'ď': 'd', 'ť': 't', 'ň': 'n',
  'Ě': 'E', 'Š': 'S', 'Č': 'C', 'Ř': 'R', 'Ž': 'Z',
  'Ý': 'Y', 'Á': 'A', 'Í': 'I', 'É': 'E', 'Ď': 'D', 'Ť': 'T', 'Ň': 'N', 'ó': 'o', 'Ó': 'O', '\u00A0': ' ',
  'ů': 'u', 'Ů': "U", "Ú": "U", "–": "-"
};

const translateCzechChars = (text: string): string => {
  return text.split('').map(char => czechToAscii[char] || char).join('');
};

export const convertCzechCharsInWorksheet = (worksheet: xlsx.WorkSheet): xlsx.WorkBook => {
    // Convert worksheet to JSON
    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

    // Process the data
    const convertedData = jsonData.map(row =>
      row.map(cell => (typeof cell === 'string' ? translateCzechChars(cell) : cell))
    );

    // Create a new worksheet with the converted data
    const newWorksheet = xlsx.utils.aoa_to_sheet(convertedData);
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'ConvertedSheet');

    return newWorkbook;
  };

// Replace these paths with your actual file paths
// const inputFile = 'D:\\knihy.xlsx';
// const outputFile = 'D:\\knihy_converted.xlsx';

// convertCzechCharsInExcel(inputFile, outputFile);
