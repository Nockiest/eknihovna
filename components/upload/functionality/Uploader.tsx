"use client";
import { excelWordsToBool, fillMissingIds } from "@/app/api/upload/excelUtils";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { postDataToEndpoint } from "@/utils/apiConections/postDataToUpload";
import { Box, List, ListItemText, Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import DataChunksTable from "../DataChunksTable";
import * as xlsx from "xlsx";
import convertExcelToJson from "@/utils/convertExcelToJson";
import downloadExcelAsArrayBuffer from "@/utils/downloadExcelAsArrayBuffer";
import readFileAsArrayBuffer from "@/utils/readFileArrayAsBUffer";
const Uploader = ({
  setResponseMessage,
}: {
  setResponseMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [chunks, setChunks] = useState<any[]>([]); // State to hold chunks
  // const uploadProgressPercent =
  //   100 - (uploadProgress.remaining / uploadProgress.total) * 100;
  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };
  // const handleUploadChunk = async (chunkIndex: number) => {
  //   const chunk = chunks[chunkIndex];
  //   try {
  //     const res = await postDataToEndpoint(chunk);

  //     if (!res.ok) {
  //       setResponseMessage(`Chyba při nahrávání části ${chunkIndex + 1}:  `);
  //       // const errorData = await res.json();

  //       // throw new Error(errorData.message || "Nahrávání selhalo");
  //     }

  //     // If the upload was successful, remove the successfully uploaded chunk from the state
  //     const updatedChunks = chunks.filter((_, index) => index !== chunkIndex);
  //     setChunks(updatedChunks);

  //     // Update progress
  //     setUploadProgress((prev) => ({
  //       total: prev.total,
  //       remaining: prev.remaining - 1,
  //     }));

  //     // Set success message only after successfully uploading
  //     setResponseMessage(`Část ${chunkIndex + 1} byla úspěšně nahrána`);
  //   } catch (e: any) {
  //     console.error("Chyba při nahrávání:", e);
  //     setResponseMessage(
  //       `Chyba při nahrávání části ${chunkIndex + 1}: ${e.message}`
  //     );
  //   }
  // };
  // const handleParseFile = async () => {
  //   if (!selectedFile) {
  //     setResponseMessage("Nebyli vybrány žádné soubory");
  //     return;
  //   }

  //   try {
  //     // Read the file into an array buffer
  //     const fileArrayBuffer = await selectedFile.arrayBuffer();
  //     const buffer = Buffer.from(fileArrayBuffer);
  //     const workbook = xlsx.read(buffer, { type: "buffer" });
  //     let worksheet = workbook.Sheets[workbook.SheetNames[0]];

  //     // Apply transformations
  //     worksheet = excelWordsToBool(worksheet, "available");
  //     worksheet = excelWordsToBool(worksheet, "formaturita");
  //     worksheet = fillMissingIds(worksheet);

  //     // Convert worksheet to JSON
  //     const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, {
  //       header: 1,
  //       defval: null,
  //     });
  //     const [headers, ...rows] = jsonData;

  //     // Store chunks in a state variable
  //     const chunkSize = 10;
  //     const newChunks = [];
  //     for (let i = 0; i < rows.length; i += chunkSize) {
  //       newChunks.push({ headers, rows: rows.slice(i, i + chunkSize) });
  //     }
  //     // setChunks(newChunks);
  //     setUploadProgress({
  //       total: newChunks.length,
  //       remaining: newChunks.length,
  //     });

  //     setResponseMessage("Data byla rozdělena do částí");
  //   } catch (e: any) {
  //     console.error("Chyba při analýze:", e);
  //     setResponseMessage(`Chyba při analýze souboru: ${e.message}`);
  //   }
  // };
  // const [uploadProgress, setUploadProgress] = useState<{
  //   total: number;
  //   remaining: number;
  // }>({
  //   total: 0,
  //   remaining: 0,
  // });

  // const [file, setFile] = useState<File | null>(null);
  const [jsonResult, setJsonResult] = useState<any[]>([]);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Read the file as an ArrayBuffer using FileReader
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const jsonData = convertExcelToJson(arrayBuffer);
      console.log(jsonData);
      setJsonResult(jsonData);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the file exists before appending
    // if (!file) {
    //   alert("Please select a file first.");
    //   return;
    // }

  //   const formData = new FormData();
  //   formData.append("file", file); // `file` is now guaranteed to not be null
  //  console.log(formData,file)
  console.log(jsonResult)
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_API_URL}/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",  // Set the content type to JSON
      },
      body:JSON.stringify(jsonResult),  // Convert jsonResult to a JSON string
    }
  );

    if (response.ok) {
      alert("File uploaded successfully");
    } else {
      alert("Error uploading file");
    }
  };
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setFile(event.target.files[0]);
  //   } else {
  //     setFile(null);
  //   }
  // };

  return (
    <Box className="mx-auto px-4 flex flex-col flex-center b-black flex-grow-1 m-8 align-center  ">
      <Typography variant="h2" className="text-xl font-semibold mb-4">
        Hromadné nahrání z tabulky
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          // handleParseFile();
        }}
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
        <button type="submit">Upload</button>
      </form>
      {/* {chunks.length > 0 && (
        <Box>
          <DataChunksTable
            chunks={chunks}
            uploadProgress={uploadProgressPercent}
            handleUploadChunk={handleUploadChunk}
          />
          <Box className="mt-4">
            <Typography>
              Pokrok nahrávání: {Math.round(uploadProgressPercent)}%
            </Typography>
            <progress value={uploadProgressPercent} max={100}></progress>
          </Box>
        </Box>
      )} */}
      <Box>
        <Box>
          <Typography variant="h6"> Návod pro hromadné nahrávání</Typography>
          <List>
            <ListItemText primary="kliněte na vybrat soubor" />
            <ListItemText primary="vyberte tabulku obsahující vaše knihy" />
            <ListItemText primary="klikněte na analyzovat soubor" />
            <ListItemText primary="soubor se automaticky rozdělí po 10 řádcích" />
            <ListItemText primary="klikněte na nahrát, u každého řádku vytvořené tabulku, aby se tyto řádky poslaly do databáze" />
            <ListItemText primary="pro kontorlu můžete stáhnout data ze serveru a prohlédnout si, jestli odpovídají nahranému obsahu" />
            <ListItemText primary="pokud se data nenahrála, pravděpodoně tabulka neobsahuje správné názvy sloupců" />
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Uploader;
{
  /* <PrimaryButton
          type="button"
          onClick={handleParseFile}
          disabled={!file}
        >
          Analyzovat soubor
          <Image
            className="m-1"
            src="icon/upload.svg"
            alt="nahrát"
            width={32}
            height={32}
          />
        </PrimaryButton> */
}
