import { insertExcelDataToPostgres } from '../db';
import { pool } from '../pool';
import * as xlsx from 'xlsx';
import { Client } from 'pg'; // or wherever your client is coming from
import { jest } from '@jest/globals';

// Create a mock client
const client = new Client();

// Mock the query method
//@ts-ignore
// client.query = jest.fn().mockResolvedValueOnce({
//     rows: [
//       { column_name: 'id', data_type: 'integer' },
//       { column_name: 'name', data_type: 'text' },
//       { column_name: 'age', data_type: 'integer' },
//     ],
//   });
// // Mock the necessary modules and functions
// jest.mock('../pool', () => ({
//   pool: {
//     connect: jest.fn().mockResolvedValue({
//       query: jest.fn(),
//       release: jest.fn(),
//     }),
//   },
// }));

// jest.mock('xlsx', () => ({
//   utils: {
//     sheet_to_json: jest.fn(),
//   },
// }));

// jest.mock('../excelUtils', () => ({
//   loadExcelSheet: jest.fn(),
//   fillMissingIds: jest.fn(),
// }));

// describe('insertExcelDataToPostgres', () => {
//   it('should insert data into PostgreSQL', async () => {
//     const filePath = 'path/to/excel/file.xlsx';
//     const tableName = 'your_table_name';

//     // Mock the Excel data
//     const worksheet = {};
//     const jsonData = [
//       ['id', 'name', 'age'],
//       [1, 'John Doe', 30],
//       [2, 'Jane Doe', 25],
//     ];

//     require('../excelUtils').loadExcelSheet.mockReturnValue({ worksheet });
//     require('../excelUtils').fillMissingIds.mockReturnValue(worksheet);
//     // xlsx.utils.sheet_to_json.mockReturnValue(jsonData);
//     xlsx.utils.sheet_to_json(jsonData );
//     const client = await pool.connect();
//     client.query.mockResolvedValueOnce({
//       rows: [
//         { column_name: 'id', data_type: 'integer' },
//         { column_name: 'name', data_type: 'text' },
//         { column_name: 'age', data_type: 'integer' },
//       ],
//     });

//     await insertExcelDataToPostgres(filePath, tableName);

//     expect(client.query).toHaveBeenCalledWith(
//       expect.stringContaining('INSERT INTO knihy'),
//       expect.any(Array)
//     );
//     expect(client.release).toHaveBeenCalled();
//   });

//   it('should throw an error if the Excel file does not contain headers', async () => {
//     const filePath = `../../${process.env.KNIHY_URL}`;
//     const tableName = 'knihy';

//     // Mock the Excel data without headers
//     const worksheet = {};
//     const jsonData = [];

//     require('../excelUtils').loadExcelSheet.mockReturnValue({ worksheet });
//     require('../excelUtils').fillMissingIds.mockReturnValue(worksheet);
//     xlsx.utils.sheet_to_json(jsonData );

//     await expect(insertExcelDataToPostgres(filePath, tableName)).rejects.toThrow(
//       'The Excel file does not contain headers'
//     );
//   });

//   // Add more test cases as needed
// });
