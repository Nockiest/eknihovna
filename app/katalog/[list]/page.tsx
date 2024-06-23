import BookCatalog from "@/components/BookCatalog";
import DotsShower from "@/components/DotsShower";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

const CatalogPage =   () => {
    const books =    getBooksByQuery();

    return (
      <Box className='w-full'>
        <Typography className="mx-auto text-center my-6" variant={"h2"}>Katalog</Typography>

        <BookCatalog promisedBooks={books} />
      </Box>
    );
  };

  export default CatalogPage;
