"use client";
import { DangerButton, PrimaryButton } from "@/theme/buttons/Buttons";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import ReroutToAUth from "../general/ReroutToAUth";
import Announcer from "@/theme/Announcer";
import { useState } from "react";
import * as xlsx from "xlsx";
import { excelWordsToBool, fillMissingIds } from "@/app/api/upload/excelUtils";
import DataChunksTable from "./DataChunksTable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SingleBookEditor from "./SingleBookEditor";
import { postDataToEndpoint } from "@/utils/apiConections/postDataToUpload";
export const revalidate = 0

const ExcelSheetUpdater = () => {
  const { data: session, status } = useSession({ required: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [chunks, setChunks] = useState<any[]>([]); // State to hold chunks
  const [uploadProgress, setUploadProgress] = useState<{
    total: number;
    remaining: number;
  }>({
    total: 0,
    remaining: 0
  });
  const uploadProgressPercent = 100 - (uploadProgress.remaining / uploadProgress.total) * 100;



  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile) {
      setResponseMessage("Nebyli vybrány žádné soubory");
      return;
    }

    try {
      // Read the file into an array buffer
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      const buffer = Buffer.from(fileArrayBuffer);
      const workbook = xlsx.read(buffer, { type: "buffer" });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Apply transformations
      worksheet = excelWordsToBool(worksheet, "available");
      worksheet = excelWordsToBool(worksheet, "formaturita");
      worksheet = fillMissingIds(worksheet);

      // Convert worksheet to JSON
      const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });
      const [headers, ...rows] = jsonData;

      // Store chunks in a state variable
      const chunkSize = 10;
      const newChunks = [];
      for (let i = 0; i < rows.length; i += chunkSize) {
        newChunks.push({ headers, rows: rows.slice(i, i + chunkSize) });
      }
      setChunks(newChunks);
      setUploadProgress({
        total: newChunks.length,
        remaining: newChunks.length
      });

      setResponseMessage("Data byla rozdělena do částí");
    } catch (e: any) {
      console.error("Chyba při analýze:", e);
      setResponseMessage(`Chyba při analýze souboru: ${e.message}`);
    }
  };

  const handleUploadChunk = async (chunkIndex: number) => {
    debugger
    const chunk = chunks[chunkIndex];
    console.log(chunk)

    try {
      const res =  await postDataToEndpoint( chunk )

      if (!res.ok) {
        // const errorData = await res.json();
        setResponseMessage(`Chyba při nahrávání části ${chunkIndex + 1}:  `);
        // throw new Error(errorData.message || "Nahrávání selhalo");
      }

      // If the upload was successful, remove the successfully uploaded chunk from the state
      const updatedChunks = chunks.filter((_, index) => index !== chunkIndex);
      setChunks(updatedChunks);

      // Update progress
      setUploadProgress(prev => ({
        total: prev.total,
        remaining: prev.remaining - 1
      }));

      // Set success message only after successfully uploading
      setResponseMessage(`Část ${chunkIndex + 1} byla úspěšně nahrána`);
    } catch (e: any) {
      console.error("Chyba při nahrávání:", e);
      setResponseMessage(`Chyba při nahrávání části ${chunkIndex + 1}: ${e.message}`);
    }
  };

  const checkData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/logDb`);
      setResponseMessage(`Aktuální počet knih: ${response.data.count || 0}`);
    } catch (error: any) {
      console.error("Chyba při získávání dat ze serveru:", error.message);
      setResponseMessage("Chyba při získávání dat: " + error.message);
    }
  };

  const deleteData = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`);
      setResponseMessage(response.data.message);
    } catch (error: any) {
      console.error("Chyba při mazání dat ze serveru:", error.message);
      setResponseMessage("Chyba při mazání dat: " + error.message);
    }
  };

  const fetchDataFromServer = async () => {
    try {
      setResponseMessage("Stahování dat ze serveru...");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/downloadExcel`, {
        responseType: "arraybuffer",
      });
      const data = new Uint8Array(response.data);
      const workbook = xlsx.read(data, { type: "array" });
      xlsx.writeFile(workbook, "data_from_server.xlsx");
      setResponseMessage("Data byla úspěšně stažena");
    } catch (error: any) {
      console.error("Chyba při získávání dat ze serveru:", error.message);
      setResponseMessage("Chyba při získávání dat: " + error.message);
    }
  };
  if (!session) {
    return (
      <div className="flex flex-center">
        <ReroutToAUth />
      </div>
    );
  }
  var splited_emails = process?.env?.WHITE_LIST_EMAILS?.split(':')
  if (splited_emails &&  session?.user?.email && splited_emails.indexOf( session?.user?.email) < 0 ) { //  session?.user?.email !== "ondralukes06@seznam.cz" && session?.user?.email !== "bauerova@gopat.cz"
    return (
      <>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Neplatný administrátorský účet
        </Typography>
        <PrimaryButton onClick={() => signOut()}>
          <Typography>Odhlásit se</Typography>
        </PrimaryButton>
      </>
    );
  }

  return (
    <Box className="flex flex-col gap-4 z-0 select-none items-center justify-center">
      <PrimaryButton onClick={() => signOut()} sx={{ margin: "2em" }}>
        <Typography>Odhlásit se</Typography>
      </PrimaryButton>

      <Box className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <Box className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <Typography variant="h2" className="text-xl font-semibold mb-4">
            Stáhnout data ze serveru
          </Typography>
          <PrimaryButton onClick={fetchDataFromServer}>
            <Image src="icon/download.svg" alt="stáhnout" width={32} height={32} />
          </PrimaryButton>
        </Box>
        <Box className="w-full md:w-1/2 p-6 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200">
          <Typography variant="h2" className="text-xl font-semibold mb-4">
            Nahrát data na server
          </Typography>

          <form
            onSubmit={(e) => { e.preventDefault(); handleParseFile(); }}
            encType="multipart/form-data"
            className="flex flex-col items-center"
          >
            <input
              type="file"
              id="fileInput"
              name="file"
              accept=".xlsx"
              className="mb-4 cursor-pointer"
              onChange={handleFileChange}
            />
            <PrimaryButton type="button" onClick={handleParseFile} disabled={!selectedFile}>
              Analyzovat soubor
              <Image className="m-1" src="icon/upload.svg" alt="nahrát" width={32} height={32} />
            </PrimaryButton>
          </form>
        </Box>
      </Box>

      <PrimaryButton onClick={checkData}>Získat aktuální počet knih</PrimaryButton>
      <SingleBookEditor />
      <DataChunksTable
        chunks={chunks}
        uploadProgress={uploadProgressPercent}
        handleUploadChunk={handleUploadChunk}
      />
      {chunks.length > 0 && <Box className="mt-4">
        <Typography>Pokrok nahrávání: {Math.round(uploadProgressPercent)}%</Typography>
        <progress value={uploadProgressPercent} max={100}></progress>
      </Box>}

      <Announcer message={responseMessage} type="normal" />
      <DangerButton onClick={deleteData}>Smazat knihy</DangerButton>
      {/* <ConfirmDeleteModal  onConfirm={deleteData} /> */}
    </Box>
  );
};

export default ExcelSheetUpdater;
