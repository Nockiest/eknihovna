"use client";
import BookCatalog from "@/features/katalog/BookCatalog";
import { Box, Typography } from "@mui/material";
import CreditMe from "@/components/CreditMe";
import { usePathname, useRouter,useSearchParams } from "next/navigation";
import PageTitleHeader from "../../components/PageTitleHeader";
import CatalogContextProvider from "@/app/katalog/CatalogContextProvider";
const CatalogPageContents = () => {

  return (
    <CatalogContextProvider>
      <Box className="w-full px-3 md:px-12">
        <PageTitleHeader title="Katalog" />
        <BookCatalog />
        <CreditMe />
      </Box>
    </CatalogContextProvider>
  );
};
export default CatalogPageContents;

// const changePage = (newPage: number) => {
//   const currentQuery = new URLSearchParams(searchParams.toString());
//   currentQuery.set("page", newPage.toString());
//   router.push(`${pathname}?${currentQuery.toString()}`);
// };
// const searchParams = useSearchParams();
// const pathname = usePathname();
// const router = useRouter();
