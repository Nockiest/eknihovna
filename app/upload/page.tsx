"use client";
import ExcelSheetUpdater from "@/components/general/ExcelSheetUpdater";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
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


=======
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { useSession } from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";

export default function Page() {
  // const [isAuth, setIsAuth] = useState<boolean>(false);
  // const session = await  getServerSession(options);
  // const { data: session, status } = useSession()
>>>>>>> nextauth

  // useEffect(() => {
  //   if (status === 'unauthenticated') {
  //     redirect('/api/auth/signin?callbackUrl=/upload');
  //   }
  // }, [status  ]);

  // if (status === 'loading') {
  //   return <div>Loading...</div>; // You can customize this loading state as needed
  // }

  // if (status === 'authenticated') {
  return (
    <SessionWrapper>
      <Box className="w-full">
        <ExcelSheetUpdater />
      </Box>
    </SessionWrapper>
  );
  // }
  // return (
  //   <Box className="w-full">
  //     {/* <AuthContext.Provider value={{ isAuth, setIsAuth }}> */}
  //       <ExcelSheetUpdater />
  //     {/* </AuthContext.Provider> */}
  //   </Box>
  // );
}
//   useEffect (() => {
//     if (!session) {

//       redirect('/api/auth/signin?callbackUrl=/upload');
//     }

//   }, [session])
