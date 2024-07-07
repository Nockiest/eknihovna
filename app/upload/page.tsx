'use client'
import ExcelSheetUpdater from "@/components/general/ExcelSheetUpdater";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { AuthContext } from "./authContext";

const Page = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  return (
    <Box className="w-full">
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <ExcelSheetUpdater />
      </AuthContext.Provider>
    </Box>
  );
};

export default Page;
