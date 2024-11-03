import ExcelSheetUpdater from "@/features/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";
import AdminPageAuthenticator from "@/features/upload/Authenticator";
import AdminPage from "@/features/upload/AdminPage";

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
        <AdminPageAuthenticator>
          <AdminPage />
        </AdminPageAuthenticator>
        {/* <ExcelSheetUpdater /> */}
      </AuthProvider>
    </Box>
  );
}
