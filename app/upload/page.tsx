"use client";
import ExcelSheetUpdater from "@/components/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import AuthProvider from "@/components/AuthProvider";
import type {  Metadata } from "next";
import { QueryClient, QueryClientProvider } from "react-query";
// export const revalidate = 0
// export const metadata: Metadata = {
//   title: "G.O. eknihovna",
//   description: "Nahrání dat",
// };

const queryClient = new QueryClient();

export default   function Page() {
  // const [filterValues, activeFilters] = useState<FiltringValues>({
  //   genres: [],
  //   category: [],
  //   author: [],
  //   name: [],
  // })


  return (
    // <UploadContext.Provider values={{
    //   filterValues,
    //   activeFilters
    // }

    // } >
    <Box className="w-full">
        <QueryClientProvider client={queryClient}>
      <AuthProvider >
        <ExcelSheetUpdater />
      </AuthProvider>
      </QueryClientProvider>
    </Box>
    //  </ UploadContext.Provider  >
  );
}
