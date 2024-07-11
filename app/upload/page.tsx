'use client'
import ExcelSheetUpdater from "@/components/general/ExcelSheetUpdater";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

const Page = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/checkAuth');
          const data = await response.json();
          setIsAuth(data.isAuthenticated);
        } catch (error) {
          console.error('Error checking authentication status:', error);
        }
      };

      checkAuth();
    }, []);



  return (
    <Box className="w-full">
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <ExcelSheetUpdater />
      </AuthContext.Provider>
    </Box>
  );
};

export default Page;
