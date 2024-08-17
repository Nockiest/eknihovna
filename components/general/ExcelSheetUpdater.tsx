"use client";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import {signOut, useSession } from "next-auth/react";
import ReroutToAUth from "./ReroutToAUth";
import Announcer from "@/theme/Announcer";
import { useState } from "react";
import * as XLSX from "xlsx";
const ExcelSheetUpdater = () => {
  const { data: session, status } = useSession({ required: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  if (!session) {
    // redirect("/api/auth/signin?callbackUrl=/upload");
    // router.push("/api/auth/signin?callbackUrl=/upload");
    return <ReroutToAUth />;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    debugger
    e.preventDefault();
    setResponseMessage("data se nahrávají");

    if (!selectedFile) {
      setResponseMessage("No file selected");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", selectedFile);
      console.log(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`)
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      setResponseMessage("data úspěšně nahrána");
    } catch (e: any) {
      console.error("Upload error:", e);
      setResponseMessage(`Error uploading data: ${e.message}`);
    }
  };

  // rewrite to prisma
  const fetchDataFromServer = async () => {
    console.log("Fetching data from server...");
    try {
      setResponseMessage("nahrávám data ze serveru");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/downloadExcel`,
        {
          responseType: "arraybuffer",
        }
      );
      const data = new Uint8Array(response.data);
      const workbook = XLSX.read(data, { type: "array" });
      setResponseMessage("vytvárřím tabulku");
      XLSX.writeFile(workbook, "data_ze_serveru.xlsx");
      setResponseMessage("data úspěšně stažena");
      console.log("Data fetched and saved locally.", workbook);
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      setResponseMessage("problém se stažením dat: " + error.message);
    }
  };

  if (session?.user?.email !== "ondralukes06@seznam.cz") {
    console.log(
      (session?.user?.email === "ondralukes06@seznam.cz").toString(),
      (process.env.ADMIN_EMAIL === "ondralukes06@seznam.cz").toString()
    );
    return (
      <>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Neplatný admin účet{" "}
          {session?.user?.email === "ondralukes06@seznam.cz"} x
          {(session?.user?.email === "ondralukes06@seznam.cz").toString()}x
          {(process.env.ADMIN_EMAIL === "ondralukes06@seznam.cz").toString()}
        </Typography>
        <PrimaryButton
          onClick={() => {
            signOut();
          }}
        >
          <Typography>Odhlásit se</Typography>
        </PrimaryButton>
      </>
    );
  }
  return (
    <Box className="flex flex-col items-center justify-center">
      <PrimaryButton
        onClick={() => {
          signOut();
        }}
        sx={{ margin: "2em" }}
      >
        <Typography>Odhlásit se</Typography>
      </PrimaryButton>

      <Box className="flex flex-col  md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <Box className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <Typography variant="h2" className="text-xl font-semibold mb-4">
            Stáhnout data ze serveru
          </Typography>
          <PrimaryButton onClick={fetchDataFromServer}>
            <Image
              src={"icon/download.svg"}
              alt="download"
              width={32}
              height={32}
            />
          </PrimaryButton>
        </Box>
        <Box className="w-full md:w-1/2 p-6 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200">
          <Typography variant="h2" className="text-xl font-semibold mb-4">
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
              onChange={handleFileChange}
            />
            <SecondaryButton type="submit" disabled={!selectedFile}>
              Nahrát
              <Image
                className="m-1"
                src="icon/upload.svg"
                alt="upload"
                width={32}
                height={32}
              />
            </SecondaryButton>
          </form>
        </Box>
      </Box>
      <Announcer message={responseMessage} type="normal" />
    </Box>
  );
};

export default ExcelSheetUpdater;
