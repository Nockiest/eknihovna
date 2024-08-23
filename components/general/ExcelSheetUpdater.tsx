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
const ExcelSheetUpdater = () => {
  const { data: session, status } = useSession({ required: true });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0)
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseMessage("Data is uploading");
    setUploadProgress(0); // Initialize progress

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
      // Apply transformations safely
      try {
        worksheet = excelWordsToBool(worksheet, "available");
        worksheet = excelWordsToBool(worksheet, "formaturita");
        worksheet = fillMissingIds(worksheet);
      } catch (transformError: any) {
        console.error("Error transforming data:", transformError);

      }
      // Convert worksheet to JSON
      const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
      });

      // Extract headers and rows
      const [headers, ...rows] = jsonData;
      const totalRows = rows.length;
      const chunkSize = 100;
      const totalChunks = Math.ceil(totalRows / chunkSize);

      // Upload each chunk sequentially
      for (let i = 0; i < totalChunks; i++) {
        const chunk = rows.slice(i * chunkSize, (i + 1) * chunkSize);

        // Create a new FormData instance for each chunk
        const chunkFormData = new FormData();
        chunkFormData.append("data", JSON.stringify({
          headers,
          chunk
        }));

        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            headers: headers,
            chunk: chunk
          }),
        });


        if (!res.ok) {
          const errorData = await res.json();
          setResponseMessage(`"Upload failed`);
          throw new Error(errorData.message || "Upload failed");
          break
        }

        // Update progress
        setUploadProgress(((i + 1) / totalChunks) * 100);
      }

      setResponseMessage("Data successfully uploaded");
    } catch (e: any) {
      console.error("Upload error:", e);
      setResponseMessage(`Error uploading data: ${e.message}`);
    }
  };
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
  const checkData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/logDb`
      );
      const data = new Uint8Array(response.data);
      console.log(data);
      setResponseMessage(response.data.count|| 0);
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      setResponseMessage("Problém se stažením dat: " + error.message);
    }
  };
  const deleteData = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/upload`
      );

      setResponseMessage(response.data.message);
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      setResponseMessage("Problém se stažením dat: " + error.message);
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
      const workbook = xlsx.read(data, { type: "array" });
      setResponseMessage("vytvárřím tabulku");
      xlsx.writeFile(workbook, "data_ze_serveru.xlsx");
      setResponseMessage("data úspěšně stažena");
      console.log("Data fetched and saved locally.", workbook);
    } catch (error: any) {
      console.error("Error fetching data from Server:", error.message);
      setResponseMessage("Problém se stažením dat: " + error.message);
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
    <Box className="flex flex-col z-0 select-none items-center justify-center">
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
          <Typography
            variant="h2"
            className="text-xl text-ceter font-semibold mb-4"
          >
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
          <Typography
            variant="h2"
            className="text-xl text-center font-semibold mb-4"
          >
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
              className="mb-4 cursor-pointer"
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
      <PrimaryButton onClick={checkData}>
        získat aktuální počet knih
      </PrimaryButton>
      <PrimaryButton onClick={deleteData}>smazat knihy</PrimaryButton>
      <Announcer message={responseMessage} type="normal" />
       <progress value={uploadProgress} max={100}></progress>
  <div>{Math.round(uploadProgress)}% uploaded</div>
    </Box>
  );
};

export default ExcelSheetUpdater;
