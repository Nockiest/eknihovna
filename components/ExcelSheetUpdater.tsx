"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import * as XLSX from "xlsx";
import { Paper, Typography } from "@mui/material";
import Image from "next/image";

const ExcelSheetUpdater = () => {
  const [responseMessage, setResponseMessage] = useState<string>("");
  const knihyURL = process.env.NEXT_PUBLIC_APP_API_URL;
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await axios.post(`${knihyURL}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
    <div className="  flex flex-col items-center justify-center p-4  ">
      <Typography variant="h3" className="m-2">
        Přepsat data na serveru
      </Typography>

      <Paper className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <Typography variant="h5" className="m-2">
            Stáhnout data ze serveru
          </Typography>
          <PrimaryButton className="my-auto" onClick={fetchDataFromServer}>
          Stáhnout <Image className="m-1" src='icon/download.svg' alt='download' width={32} height={32} />
          </PrimaryButton>
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200">
          <Typography variant="h5" className="m-2">
            Přepsat data na serveru
          </Typography>
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
            />
            <SecondaryButton type="submit">
            Nahrát <Image className="m-1" src='icon/upload.svg' alt='download' width={32} height={32} />
            </SecondaryButton>
          </form>
        </div>
      </Paper>
      <div id="response" className="mt-8 text-center">
        {responseMessage}
      </div>
    </div>
  );
};

export default ExcelSheetUpdater;
