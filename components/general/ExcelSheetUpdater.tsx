"use client";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import ReroutToAUth from "./ReroutToAUth";
import Announcer from "@/theme/Announcer";
import { useState } from "react";
import * as xlsx from "xlsx";
import { excelWordsToBool, fillMissingIds } from "@/app/api/upload/excelUtils";
import DataChunksTable from "../upload/DataChunksTable";


const ExcelSheetUpdater = () => {
  const { data: session, status } = useSession({ required: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [chunks, setChunks] = useState<any[]>([]); // State to hold chunks

  if (!session) {
    return (
      <div className="flex flex-center">
        <ReroutToAUth />
      </div>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile) {
      setResponseMessage("No file selected");
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
      const chunkSize = 100;
      const newChunks = [];
      for (let i = 0; i < rows.length; i += chunkSize) {
        newChunks.push({ headers, chunk: rows.slice(i, i + chunkSize) });
      }
      setChunks(newChunks);

      setResponseMessage("Data parsed into chunks");
    } catch (e: any) {
      console.error("Parse error:", e);
      setResponseMessage(`Error parsing file: ${e.message}`);
    }
  };

  const handleUploadChunk = async (chunkIndex: number) => {
    const chunk = chunks[chunkIndex];

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      // Remove the successfully uploaded chunk from the state
      const updatedChunks = chunks.filter((_, index) => index !== chunkIndex);
      setChunks(updatedChunks);

      // Update progress
      setUploadProgress(prev => prev+((chunks.length - updatedChunks.length) / chunks.length) * 100);

      setResponseMessage(`Chunk ${chunkIndex + 1} uploaded successfully`);
    } catch (e: any) {
      console.error("Upload error:", e);
      setResponseMessage(`Error uploading chunk ${chunkIndex + 1}: ${e.message}`);
    }
  };

  const checkData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/logDb`);
      setResponseMessage(`Current book count: ${response.data.count || 0}`);
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      setResponseMessage("Error fetching data: " + error.message);
    }
  };

  const deleteData = async () => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`);
      setResponseMessage(response.data.message);
    } catch (error: any) {
      console.error("Error deleting data from Server:", error.message);
      setResponseMessage("Error deleting data: " + error.message);
    }
  };

  const fetchDataFromServer = async () => {
    try {
      setResponseMessage("Downloading data from server...");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/downloadExcel`, {
        responseType: "arraybuffer",
      });
      const data = new Uint8Array(response.data);
      const workbook = xlsx.read(data, { type: "array" });
      xlsx.writeFile(workbook, "data_from_server.xlsx");
      setResponseMessage("Data successfully downloaded");
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      setResponseMessage("Error fetching data: " + error.message);
    }
  };

  if (session?.user?.email !== "ondralukes06@seznam.cz") {
    return (
      <>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Invalid admin account
        </Typography>
        <PrimaryButton onClick={() => signOut()}>
          <Typography>Sign Out</Typography>
        </PrimaryButton>
      </>
    );
  }

  return (
    <Box className="flex flex-col z-0 select-none items-center justify-center">
      <PrimaryButton onClick={() => signOut()} sx={{ margin: "2em" }}>
        <Typography>Sign Out</Typography>
      </PrimaryButton>

      <Box className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <Box className="w-full md:w-1/2 p-6 flex flex-col items-center">
          <Typography variant="h2" className="text-xl font-semibold mb-4">
            Download Data from Server
          </Typography>
          <PrimaryButton onClick={fetchDataFromServer}>
            <Image src="icon/download.svg" alt="download" width={32} height={32} />
          </PrimaryButton>
        </Box>
        <Box className="w-full md:w-1/2 p-6 flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-200">
          <Typography variant="h2" className="text-xl font-semibold mb-4">
            Upload Data to Server
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
              Parse File
              <Image className="m-1" src="icon/upload.svg" alt="upload" width={32} height={32} />
            </PrimaryButton>
          </form>
        </Box>
      </Box>

      <PrimaryButton onClick={checkData}>Get Current Book Count</PrimaryButton>
      <PrimaryButton onClick={deleteData}>Delete Books</PrimaryButton>
      <DataChunksTable
        chunks={chunks}
        uploadProgress={uploadProgress}
        handleUploadChunk={handleUploadChunk}
      />
      {/* {chunks.length > 0 && (
        <Box className="mt-6 w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <Typography variant="h2" className="text-xl font-semibold mb-4 p-4">
            Data Chunks
          </Typography>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chunk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rows</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chunks.map((chunk, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`Chunk ${index + 1}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chunk.chunk.length} rows</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <PrimaryButton onClick={() => handleUploadChunk(index)}  >
                      Upload
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )} */}

      <div className="mt-4">
        <Typography>Upload Progress: {Math.round(uploadProgress)}%</Typography>
        <progress value={uploadProgress} max={100}></progress>
      </div>

      <Announcer message={responseMessage} type="normal" />
    </Box>
  );
};

export default ExcelSheetUpdater;

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setResponseMessage("Data is uploading");

  //   if (!selectedFile) {
  //     setResponseMessage("No file selected");
  //     return;
  //   }

  //   try {
  //     // Read the file into an array buffer
  //     const fileArrayBuffer = await selectedFile.arrayBuffer();
  //     const buffer = Buffer.from(fileArrayBuffer);
  //     const workbook = XLSX.read(buffer, { type: "buffer" });
  //     const sheetNames = workbook.SheetNames;
  //     setUploadProgress(0)
  //     // Split and upload each sheet separately
  //     for (const sheetName of sheetNames) {
  //       const worksheet = workbook.Sheets[sheetName];

  //       // Convert worksheet to JSON
  //       const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
  //         header: 1,
  //         defval: null,
  //       });

  //       // Extract headers and rows
  //       const [headers, ...rows] = jsonData;
  //       const totalRows = rows.length;
  //       const chunkSize = 100; // Number of rows per chunk
  //       const totalChunks = Math.ceil(totalRows / chunkSize);

  //       // Upload each chunk sequentially
  //       for (let i = 0; i < totalChunks; i++) {
  //         const chunk = rows.slice(i * chunkSize, (i + 1) * chunkSize);

  //         // Create a new workbook for each chunk
  //         const newWorkbook = XLSX.utils.book_new();
  //         const newWorksheet = XLSX.utils.aoa_to_sheet([headers, ...chunk]);
  //         XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

  //         // Convert the new workbook to a buffer
  //         const chunkBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'buffer' });

  //         // Create a new FormData instance for each chunk
  //         const chunkFormData = new FormData();
  //         chunkFormData.append("file", new Blob([chunkBuffer]), `chunk_${i + 1}.xlsx`);

  //         // Upload the chunk
  //         const res = await axios.post(
  //           `${process.env.NEXT_PUBLIC_APP_API_URL}/upload`,
  //           chunkFormData,
  //           {
  //             headers: {
  //               'Content-Type': 'multipart/form-data',
  //             },
  //           }
  //         );

  //         if (res.status !== 200) {
  //           throw new Error('Upload failed');
  //         }

  //         // Optionally update progress here
  //         setUploadProgress(((i + 1) / totalChunks) * 100);
  //       }
  //     }

  //     setResponseMessage("Data successfully uploaded");
  //   } catch (e: any) {
  //     console.error("Upload error:", e);
  //     setResponseMessage(`Error uploading data: ${e.message}`);
  //   }
  // };
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setResponseMessage("data se nahrávají");

  //   if (!selectedFile) {
  //     setResponseMessage("No file selected");
  //     return;
  //   }
  //   console.log("x");
  //   try {
  //     const data = new FormData();
  //     data.append("file", selectedFile);
  //     console.log(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`);
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`, {
  //       method: "POST",
  //       body: data,
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || "Upload failed");
  //     }

  //     setResponseMessage("data úspěšně nahrána");
  //   } catch (e: any) {
  //     console.error("Upload error:", e);
  //     setResponseMessage(`Error uploading data: ${e.message}`);
  //   }
  // };