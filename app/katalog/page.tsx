"use client";
import BookCatalog from "@/components/catalog/BookCatalog";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Button, Fab, Typography } from "@mui/material";
import SearchBar from "@/components/catalog/SearchBar";
import Image from "next/image";
import { useState } from "react";
import Searcher from "@/components/catalog/Searcher";
import SearcherOpenerFab from "@/components/catalog/SearcheOpenerFab";

const CatalogPage = () => {
  const books = getBooksByQuery();
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  return (
    <Box className="w-full">
      <Box display="flex" alignItems="space-between" justifyContent={'center'}>
        {/* <Fab
          size="large"
          onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}
        >
          <Image
            src="icon/search.svg"
            alt="search"
            width={32}
            height={32}
            className="m-1"
          />
        </Fab> */}
        <SearcherOpenerFab  onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }} />
        <Typography className="mx-auto text-center my-6" variant={"h2"}>
          Katalog
        </Typography>
      </Box>
      <BookCatalog promisedBooks={books} />
      {isOpenSearcher.toString()}
      <Searcher isOpen={isOpenSearcher} />
    </Box>
  );
};

export default CatalogPage;
