"use client";

import { FormEvent, useState } from 'react';
import axios from 'axios';
import { PrimaryButton } from '@/theme/buttons/Buttons';
// import * as XLSX from 'xlsx';

const ExcelSheetUpdater = () => {
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await axios.post('http://localhost:3002/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResponseMessage(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error('Error:', error);
      setResponseMessage('Error: ' + error.message);
    }
  };

  const fetchDataFromServer = async () => {
    console.log('Fetching data from server...');
    try {
    //   const response = await axios.get('http://localhost:3002', { responseType: 'arraybuffer' });
    //   const data = new Uint8Array(response.data);
    //   const workbook = XLSX.read(data, { type: 'array' });
    //   XLSX.writeFile(workbook, 'knihy.xlsx');
    //   console.log('Data fetched and saved locally.');
    } catch (error: any) {
      console.error('Error fetching data from Server:', error.message);
      alert('Error fetching data from Server: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Excel Data Widget</h1>
      <button onClick={fetchDataFromServer}>Fetch Data from Server</button>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" id="fileInput" name="file" accept=".xlsx" />
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
      <div id="response">{responseMessage}</div>
    </div>
  );
};

export default ExcelSheetUpdater;
