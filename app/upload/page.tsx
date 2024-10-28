"use client";
import ExcelSheetUpdater from "@/components/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { Book } from "@/types/types";
import { UploadContext } from "./context";
import fetchFilteredBooks from "@/utils/apiConections/fetchFilteredBooks";

// export const revalidate = 0
// export const metadata: Metadata = {
//   title: "G.O. eknihovna",
//   description: "Nahrání dat",
// };

export default function Page() {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    const fetching = async () => {
      const b: Book[] = await fetchFilteredBooks();
      console.log("Fetched books:", b.length);
      setBooks(b);
    };
    fetching();
  }, []);
  return (

    <Box className="w-full">
      <AuthProvider>
        <UploadContext.Provider value={{ books }}>
          <ExcelSheetUpdater />
        </UploadContext.Provider>
      </AuthProvider>
    </Box>
  );
}
