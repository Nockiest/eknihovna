import ExcelSheetUpdater from "@/features/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";

export const revalidate = 0;
export const metadata: Metadata = {
  title: "G.O. eknihovna",
  description: "Nahrání dat",
};
// this should remain server rendered due to the auth contenxt
export default async function Page() {
  return (
    <Box className="w-full">
      <AuthProvider>
        <ExcelSheetUpdater />
      </AuthProvider>
    </Box>
  );
}
