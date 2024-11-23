import { PrimaryButton } from "@/theme/buttons/Buttons";
import React from "react";
import type { Metadata } from "next";
import { Box, List, ListItem, Typography } from "@mui/material";
import Link from "next/link";
import CreditMe from "@/components/CreditMe";
import BauerovaLink from "@/components/BauerovaLink";
import BorrowingInformation from "@/components/BorrowingInformation";
import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: "Informace o GO knihovně",
  description: "Vše o výpůjčce a kontakt na knihovnu",
};
const page = () => {
  return (
    <Box justifyContent={"center"} className="w-auto">
     <Analytics />
      {BorrowingInformation()}


      <BauerovaLink />
      <Box className="w-full my-8 flex flex-col flex-center">
        <PrimaryButton className="mx-auto">
          <Link href="/katalog">Půjčit si knihu</Link>
        </PrimaryButton>
      </Box>
      <Box className=" text-blue-500 w-full flex flex-row justify-center hover:underlinevflex  ">
        <Link
          className=" text-blue-500 mx-auto hover:underline flex justify-center"
          href="https://drive.google.com/file/d/18zk9IG9MlaM3cdiUdRVc0s11h7FJ_LcV/view"
        >
          <Typography className="mx-auto text-center align-center">
            Seznam maturitní četby a maturitní okruhy 2024/25
          </Typography>
        </Link>
      </Box>

      <CreditMe />
    </Box>
  );
};

export default page;
