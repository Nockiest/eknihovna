// "use client";
import ExcelSheetUpdater from "@/components/upload/ExcelSheetUpdater";
import { Box } from "@mui/material";
import { options } from "../api/auth/[...nextauth]/options";
import AuthProvider from "@/components/AuthProvider";
import type {  Metadata } from "next";

export const metadata: Metadata = {
  title: "G.O. eknihovna",
  description: "Nahrání dat",
};
export default async function Page() {

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
