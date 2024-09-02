// "use client";
import ExcelSheetUpdater from "@/components/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import { options } from "../api/auth/[...nextauth]/options";
import AuthProvider from "@/components/AuthProvider";
import type {  Metadata } from "next";
export const revalidate = 0
export const metadata: Metadata = {
  title: "G.O. eknihovna",
  description: "Nahrání dat",
};
export default async function Page() {

  return (
    <Box className="w-full">
      <AuthProvider>
        <ExcelSheetUpdater />
      </AuthProvider>
    </Box>
  );
}
