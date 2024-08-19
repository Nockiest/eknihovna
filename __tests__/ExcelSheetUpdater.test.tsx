// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import ExcelSheetUpdater from '@/components/general/ExcelSheetUpdater';
// import { useSession } from 'next-auth/react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// // Mock the useSession hook from next-auth/react
// jest.mock('next-auth/react', () => ({
//   useSession: jest.fn(),
//   signOut: jest.fn(),
// }));

// jest.mock('axios');

// jest.mock('xlsx', () => ({
//   ...jest.requireActual('xlsx'),
//   read: jest.fn(),
//   writeFile: jest.fn(),
// }));

// describe('ExcelSheetUpdater', () => {
//   beforeEach(() => {
//     // Mock the session with a user
//     (useSession as jest.Mock).mockReturnValue({
//       data: {
//         user: { email: 'ondralukes06@seznam.cz' },
//       },
//       status: 'authenticated',
//     });
//   });
//   beforeEach(() => {
//     // Mock XLSX.read to return a specific value
//     (XLSX.read as jest.Mock).mockReturnValue({
//       Sheets: {
//         'Sheet1': {}
//       },
//       SheetNames: ['Sheet1']
//     });
//   });

//   it('renders and allows file selection', () => {
//     render(<ExcelSheetUpdater />);

//     const fileInput = screen.getByLabelText(/přepsat data na serveru/i);
//     expect(fileInput).toBeInTheDocument();
//   });

//   it('shows error when no file is selected and form is submitted', async () => {
//     render(<ExcelSheetUpdater />);

//     const submitButton = screen.getByText(/nahrát/i);
//     fireEvent.click(submitButton);

//     const errorMessage = await screen.findByText(/no file selected/i);
//     expect(errorMessage).toBeInTheDocument();
//   });

//   it('submits the form and uploads the file', async () => {
//     const fakeFile = new File(['fake content'], 'test.xlsx', {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     });

//     (axios.post as jest.Mock).mockResolvedValueOnce({
//       status: 200,
//       data: { success: true },
//     });

//     render(<ExcelSheetUpdater />);

//     const fileInput = screen.getByLabelText(/Přepsat data na serveru/i);
//     fireEvent.change(fileInput, {
//       target: { files: [fakeFile] },
//     });

//     const submitButton = screen.getByText(/nahrát/i);
//     fireEvent.click(submitButton);

//     await waitFor(() =>
//       expect(screen.getByText(/data úspěšně nahrána/i)).toBeInTheDocument()
//     );

//     expect(axios.post).toHaveBeenCalledWith(
//       `${process.env.NEXT_PUBLIC_APP_API_URL}/upload`,
//       expect.any(FormData),
//       { headers: { 'Content-Type': 'multipart/form-data' } }
//     );
//   });

//   it('fetches data from server and writes to file', async () => {
//     const mockData = new Uint8Array([1, 2, 3, 4]);
//     (axios.post as jest.Mock).mockResolvedValueOnce({
//       status: 200,
//       data: mockData,
//     });

//     const workbook = XLSX.read(new Uint8Array(), { type: 'array' });

//     // Assert that XLSX.read was called and returned the mocked value
//     expect(workbook.SheetNames).toContain('Sheet1');

//     render(<ExcelSheetUpdater />);

//     const downloadButton = screen.getByText(/stáhnout data ze serveru/i);
//     fireEvent.click(downloadButton);

//     await waitFor(() =>
//       expect(XLSX.writeFile).toHaveBeenCalledWith(
//         expect.any(Object),
//         'data_ze_serveru.xlsx'
//       )
//     );

//     expect(screen.getByText(/data úspěšně stažena/i)).toBeInTheDocument();
//   });
// });
