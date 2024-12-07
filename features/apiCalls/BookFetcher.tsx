import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import * as xlsx from "xlsx";


const BookFetcher = (    )=> {
  const { data: session } = useSession({ required: true });

  const fetchDataFromServer = async () => {
    try {
      // setResponseMessage("Stahování dat ze serveru...");
      // If you're using authentication, replace `adminname` with the value from your auth logic

      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/downloadExcel`, {
        responseType: "arraybuffer",
        headers: {
          "x-admin-name": session?.user?.email, // Add the admin name to the headers
        },
      });

      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;

      // Set the file name with the formatted date
      const fileName = `${formattedDate}-knihyGO.xlsx`;
      const data = new Uint8Array(response.data);
      const workbook = xlsx.read(data, { type: "array" });
      xlsx.writeFile(workbook, fileName);
      alert("Data byla úspěšně stažena");
    } catch (error: any) {
      console.error("Chyba při získávání dat ze serveru:", error.message);
      alert("Chyba při získávání dat: " + error.message);
    }
  }
  return (
    <Box className=" flex-grow-1   p-6 flex flex-col items-center">
    <Typography variant="h2" className="text-xl font-semibold mb-4">
      Stáhnout data ze serveru
    </Typography>
    <PrimaryButton onClick={fetchDataFromServer}>
      <Image src="icon/download.svg" alt="stáhnout" width={32} height={32} />
    </PrimaryButton>
  </Box>
  )
}

export default BookFetcher