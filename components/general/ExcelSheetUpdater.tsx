"use client";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
// import { useAuthContext } from "@/app/upload/authContext";
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
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log(0);
  //   if (!selectedFile) return;

  //   try {
  //     const data = new FormData();
  //     console.log(selectedFile);
  //     data.set("file", selectedFile);
  //     console.log(1);
  //     setResponseMessage("data se nahrávají");
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/update`, {
  //       method: "POST",
  //       body: data,
  //     });
  //     setResponseMessage("data úspěšně nahrána");
  //     console.log(2);
  //     // handle the error
  //     if (!res.ok) throw new Error(await res.text());
  //   } catch (e: any) {
  //     // Handle errors here
  //     console.error(e);
  //     setResponseMessage("problém s nahráním dat: " + e.message);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseMessage("Starting upload...");

    if (!selectedFile) {
      setResponseMessage("No file selected");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", selectedFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload failed");
      }

      setResponseMessage("Data uploaded successfully");
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
// if (!session || !session?.user) {
//   return (
//     <PrimaryButton
//       onClick={() => {
//         signIn("google");
//       }}
//     >
//       <Typography>Přihlaste se pro vstup</Typography>
//     </PrimaryButton>
//   );
// }
{
  /* <form
onSubmit={async (e) => {
  const res = await authenticate(e, password);
  if (res) {
    setResponseMessage("Authentication successful");
    setAuthenticated(true);
  } else {
    setResponseMessage("Authentication failed");
  }
}}
className="w-1/2 flex flex-col items-center justify-center mt-16 mx-auto"
>
<label htmlFor="password" className="block mb-2">
  Pro práci s daty vepište heslo:
</label>
<PasswordHandler */
}
{
  /* <PasswordEntry
  label="heslo"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/> */
}

//   <PrimaryButton type="submit">Autorizovat</PrimaryButton>
//   <div id="response">{responseMessage}</div>
// </form>

// const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();

//   // Assuming you have a file input with id "fileInput"
//   const fileInput = document.getElementById("fileInput") as HTMLInputElement;
//   const file = fileInput.files && fileInput.files[0];

//   if (!file) {
//     console.error("No file selected");
//     return;
//   }

//   // Create FormData object
//   const formData = new FormData();
//   formData.append("file", file); // Append the file to FormData
//   // formData.append("password", password); // Append other form data as needed
//   //https://eknihovna.onrender.com/api
//   //${process.env.NEXT_PUBLIC_APP_API_URL}/update
//   try {
//      // rewrite to prisma
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_URL}/update`, formData, {
//       headers: {
//         "content-type": "multipart/form-data", // Set content type to multipart/form-data
//       },
//     });

//     setResponseMessage(JSON.stringify(response.data, null, 2));
//   } catch (error: any) {
//     console.error("Error:", error);
//     setResponseMessage("Error: " + error.message);
//   }
// };
