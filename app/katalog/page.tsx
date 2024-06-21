

import BookCatalog from "@/components/BookCatalog";
import DotsShower from "@/components/DotsShower";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const CatalogPage =   () => {
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
