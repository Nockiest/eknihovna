"use client";
import ExcelSheetUpdater from "@/components/general/ExcelSheetUpdater";
import { Box } from "@mui/material";
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { useSession } from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";
import AuthProvider from "@/components/AuthProvider";

export default function Page() {

  return (
    <Box className="w-full">
      <AuthProvider>
        <ExcelSheetUpdater />
      </AuthProvider>
    </Box>
  );
}

  // const [isAuth, setIsAuth] = useState<boolean>(false);
  // const session = await  getServerSession(options);

  // if (status === 'authenticated') {
  
//   useEffect (() => {
//     if (!session) {

//       redirect('/api/auth/signin?callbackUrl=/upload');
//     }

//   }, [session])
// useEffect(() => {
//   if (status === 'unauthenticated') {
//     redirect('/api/auth/signin?callbackUrl=/upload');
//   }
// }, [status  ]);

// if (status === 'loading') {
//   return <div>Loading...</div>; // You can customize this loading state as needed
// }
