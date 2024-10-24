"use client";
import ExcelSheetUpdater from "@/components/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import AuthProvider from "@/components/AuthProvider";
import type {  Metadata } from "next";
import { UploadContext } from "./context";
import { useState } from "react";
import { FiltringValues } from "@/types/types";
import { defaultFilters } from "@/data/values";
// export const revalidate = 0
// export const metadata: Metadata = {
//   title: "G.O. eknihovna",
//   description: "Nahrání dat",
// };
export default async function Page() {
  const [filterValues, activeFilters] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
    name: [],
  })


  return (
    <UploadContext.Provider values={{
      filterValues,
      activeFilters
    }

    } >
    <Box className="w-full">
      <AuthProvider >
        <ExcelSheetUpdater />
      </AuthProvider>
    </Box>
     </ UploadContext.Provider  >
  );
}
