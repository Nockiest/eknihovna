'use client'
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import * as XLSX from "xlsx";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";


import { useState } from 'react';
import axios from 'axios';
import PasswordEntry from "./PasswordHolder";

const ExcelSheetUpdater = () => {
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const knihyURL = process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:3002'; // Adjust URL as per your backend setup

  const authenticate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${knihyURL}/authenticate`, { password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setResponseMessage('Authentication successful');
        setAuthenticated(true);
      } else {
        setResponseMessage('Authentication failed');
      }
    } catch (error: any) {
      console.error("Error:", error);
      setResponseMessage("Error: " + error.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${knihyURL}/update`, { password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponseMessage(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error("Error:", error);
      setResponseMessage("Error: " + error.message);
    }
  };

  const fetchDataFromServer = async () => {
    console.log("Fetching data from server...");
    try {
      const response = await axios.get(`${knihyURL}/downloadExcel`, {
        responseType: "arraybuffer",
      });
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      XLSX.writeFile(workbook, "data ze serveru.xlsx");
      console.log("Data fetched and saved locally.");
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      alert("Error fetching data from Server: " + error.message);
    }
  };

  return (
    <Box className='flex flex-col items-center justify-center'>
      {!authenticated ? (
        <form onSubmit={authenticate} className="w-1/2 flex flex-col items-center justify-center mt-16 mx-auto">
          <label htmlFor="password" className="block mb-2">Pro úpravu dat vepište heslo:</label>
        <PasswordEntry label='heslo' value={password}   onChange={(e) => setPassword(e.target.value)} />

          <PrimaryButton type="submit">
            Autorizovat
          </PrimaryButton>
          <div id="response">{responseMessage}</div>
        </form>
      ) : (
        <div className="flex flex-col  md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Stáhnout data ze serveru</h2>
            <PrimaryButton onClick={fetchDataFromServer}>
              Stáhnout data ze serveru
            </PrimaryButton>
          </div>
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Přepsat data na serveru</h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center">
            <input
              type="file"
              id="fileInput"
              name="file"
              accept=".xlsx"
              className="mb-4"
            />

              <SecondaryButton type="submit">
                Nahrát <Image className="m-1" src="icon/upload.svg" alt="download" width={32} height={32} />
              </SecondaryButton>
            </form>
          </div>
        </div>
      )}
      <div id="response" className="mt-8 text-center">{responseMessage}</div>
    </Box>


  );
};

export default ExcelSheetUpdater;

  // <div>
        //   <h1>Aktualizace webových dat</h1>
        //   <PrimaryButton onClick={fetchDataFromServer} className="mb-4">
        //     Stáhnout data ze serveru
        //   </PrimaryButton>
        //   <form onSubmit={handleSubmit} encType="multipart/form-data">
        //     <input
        //       type="file"
        //       id="fileInput"
        //       name="file"
        //       accept=".xlsx"
        //       className="mb-4"
        //     />
        //     <SecondaryButton type="submit">
        //       Přepsat data na serveru
        //     </SecondaryButton>
        //   </form>
        //   <div id="response">{responseMessage}</div>
      // </div>
