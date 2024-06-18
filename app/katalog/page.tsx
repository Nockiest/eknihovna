// "use client";
// import BookCatalog from "@/components/Catalog";
// import { Book } from "@/types/types";
// import { Box, Typography } from "@mui/material";
// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const CatalogPage = () => {
//   const [shownBooks, setShownBooks] = useState<Book[]>([]);

//   useEffect(() => {
//     axios
//       .get("http://localhost:3002/bookList", { params: { query: "" } })
//       .then((response: any) => {
//         const data = response.data;
//         if (data === null) {
//           return;
//         }

//         setShownBooks(data.rows);
//       })
//       .catch((error: any) => {
//         throw new Error(`problem with fetching data ${error} `);
//       });
//   }, []);

//   return (
//     <Box>
//       <Typography variant={"h2"}>Katalog</Typography>
//       <BookCatalog shownBooks={shownBooks} />
//     </Box>
//   );
// };

// export default CatalogPage;


import BookCatalog from "@/components/Catalog";
import { Book } from "@/types/types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CatalogPage = async () => {

  const getBooksByQuery = async (): Promise<Book[]> => {
    try {
      const response = await axios.get("http://localhost:3002/bookList", { params: { query: "" } });
      const data = response.data;

      if (data === null) {
        return [];
      }

      const knihy: Book[] = data ;
      console.log('prvni kniha ' , knihy[0])
       // Object.keys(resolvedBooks).forEach(key => {
        //   console.log(`${key}: ${resolvedBooks[key]}`);
        // });
      return knihy;
    } catch (error: any) {
      throw new Error(`Problem with fetching data: ${error}`);
    }
  };

  const books =    getBooksByQuery();

  return (
    <Box>
      <Typography variant={"h2"}>Katalog</Typography>
      <BookCatalog shownBooks={books} />
    </Box>
  );
};

export default CatalogPage;


// import React from "react";
// import BookCatalog from "@/components/Catalog";
// import { Book } from "@/types/types";
// import { Box, Typography } from "@mui/material";
// import { GetServerSideProps } from "next";
// import { getBooksByQuery } from "@/utils/fetchBooks";

// interface CatalogPageProps {
//   books: Book[];
//   error: string | null;
// }

// const CatalogPage: React.FC<CatalogPageProps> = ({ books, error }) => {
//   if (error) {
//     return (
//       <Box>
//         <Typography variant={"h2"}>Katalog</Typography>
//         <Typography variant={"body1"} color="error">
//           {error}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography variant={"h2"}>Katalog</Typography>
//       <BookCatalog shownBooks={books} />
//     </Box>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const books = await getBooksByQuery();
//     return {
//       props: {
//         books,
//         error: null,
//       },
//     };
//   } catch (error: any) {
//     return {
//       props: {
//         books: [],
//         error: error.message,
//       },
//     };
//   }
// };

// export default CatalogPage;
