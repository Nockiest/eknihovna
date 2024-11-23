import ExcelSheetUpdater from "@/deprecated/ExcelSheetUpdater";
import { Box } from "@mui/material";
import AuthProvider from "@/components/AuthProvider";
import type { Metadata } from "next";
import AdminPageAuthenticator from "@/features/upload/Authenticator";
import AdminPage from "@/features/upload/AdminPage";
import { Analytics } from "@vercel/analytics/react";

export const revalidate = 0;
export const metadata: Metadata = {
  title: "GO eknihovna",
  description: "Nahrání dat",
};
// this should remain server rendered due to the auth contenxt
export default async function Page() {
  return (
    <Box className="w-full">
        <Analytics />
      <AuthProvider>
        <AdminPageAuthenticator>
          <AdminPage />
        </AdminPageAuthenticator>
      </AuthProvider>
    </Box>
  );
}
