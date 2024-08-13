// "use client";
import ExcelSheetUpdater from "@/components/general/ExcelSheetUpdater";
import { Box } from "@mui/material";
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import { useSession } from "next-auth/react";
import SessionWrapper from "@/components/SessionWrapper";
import AuthProvider from "@/components/AuthProvider";
// import { PrismaClient } from '@prisma/client'

export default async function Page() {

  // const newBook = await prisma.knihy.create({
  //   data: {
  //     id: 'x',  // Replace with your actual unique ID or a UUID generator
  //     book_code: 123456,      // Replace with the actual book code
  //     name: 'Book Name',      // Replace with the actual book name
  //     author: 'Author Name',  // Replace with the actual author name
  //     category: 'Category',   // Replace with the actual category
  //     genres: ['Genre1', 'Genre2'], // Replace with the actual genres
  //     umisteni: 'Location',   // Replace with the actual location
  //     signatura: 'Signature', // Replace with the actual signature
  //     zpusob_ziskani: 'Method of Acquisition', // Replace with the actual acquisition method
  //     formaturita: true,      // Replace with true or false depending on whether it's formal
  //     available: true,        // Replace with true or false depending on availability
  //     rating: 5               // Replace with the actual rating
  //   },
  // });
  // const books = await prisma.knihy.findMany()//response.data.books;
  // console.log(books)
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
