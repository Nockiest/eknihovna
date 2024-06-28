"use client";
import BookCatalog from "@/components/catalog/BookCatalog";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Typography } from "@mui/material";
import Searcher from "@/components/catalog/Searcher";
import SearcherOpenerFab from "@/components/catalog/SearcheOpenerFab";
import {   useEffect, useState } from "react";
import { Book, Filters } from "@/types/types";
import { fetchGenres } from "@/utils/fetchGenres";
import { SearchContext } from "./context";

const CatalogPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    genres: [],
    available: false,
    forMaturita: false,
  });
  const allGenres = fetchGenres();
  useEffect(() => {
    async function update() {
      const newBooks = await getBooksByQuery();
      setBooks(newBooks);
    }
    update();
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isOpenSearcher,
        setOpenSearcher,
        filters,
        setFilters,
        books,
        setBooks,
      }}
    >
      <Box className="w-full">
        <Box
          display="flex"
          alignItems="space-between"
          justifyContent={"center"}
        >
          <SearcherOpenerFab
            onClick={() => {
              setOpenSearcher(!isOpenSearcher);
            }}
          />
          <Typography className="mx-auto text-center my-6" variant={"h2"}>
            Katalog
          </Typography>
        </Box>
        <BookCatalog promisedBooks={books} />

        <Searcher />
      </Box>
    </SearchContext.Provider>
  );
};

export default CatalogPage;
