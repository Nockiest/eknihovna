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

        <BookCatalog books={books} />
      </Box>
    );
  };

  export default CatalogPage;
