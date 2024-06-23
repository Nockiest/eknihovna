"use client";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import * as XLSX from "xlsx";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";

import { useState } from "react";
import axios from "axios";
import PasswordEntry from "./PasswordHolder";

const ExcelSheetUpdater = () => {
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const knihyURL =
    process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3002"; // Adjust URL as per your backend setup

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const authenticate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${knihyURL}/authenticate`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setResponseMessage("Authentication successful");
        setAuthenticated(true);
      } else {
        setResponseMessage("Authentication failed");
      }
    } catch (error: any) {
      console.error("Error:", error);
      setResponseMessage("Error: " + error.message);
    }
  };

 
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Assuming you have a file input with id "fileInput"
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      console.error('No file selected');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData
    formData.append('password', password); // Append other form data as needed

    try {
      const response = await axios.post(`${knihyURL}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      });

      setResponseMessage(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error('Error:', error);
      setResponseMessage('Error: ' + error.message);
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
    <Box className="flex flex-col items-center justify-center">
      {!authenticated ? (
        <form
          onSubmit={authenticate}
          className="w-1/2 flex flex-col items-center justify-center mt-16 mx-auto"
        >
          <label htmlFor="password" className="block mb-2">
            Pro práci s daty vepište heslo:
          </label>
          <PasswordEntry
            label="heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PrimaryButton type="submit">Autorizovat</PrimaryButton>
          <div id="response">{responseMessage}</div>
        </form>
      ) : (
        <div className="flex flex-col  md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">
              Stáhnout data ze serveru
            </h2>
            <PrimaryButton onClick={fetchDataFromServer}>
              Stáhnout data ze serveru
            </PrimaryButton>
          </div>
          <Box className="w-full md:w-1/2 p-6 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Přepsat data na serveru
            </h2>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="flex flex-col items-center"
            >
              <input
                type="file"
                id="fileInput"
                name="file"
                accept=".xlsx"
                className="mb-4"
                onChange={handleFileChange}
              />
              <SecondaryButton type="submit" disabled={!selectedFile}>
                Nahrát{" "}
                <Image
                  className="m-1"
                  src="icon/upload.svg"
                  alt="download"
                  width={32}
                  height={32}
                />
              </SecondaryButton>
            </form>
          </Box>
        </div>
      )}
      <div id="response" className="mt-8 text-center">
        {responseMessage}
      </div>
    </Box>
  );
};

export default ExcelSheetUpdater;
