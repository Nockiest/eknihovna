"use client";

import BookCatalog from "@/components/catalog/BookCatalog";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Typography, CircularProgress } from "@mui/material";
import Searcher from "@/components/catalog/Searcher";
import SearcherOpenerFab from "@/components/catalog/SearcheOpenerFab";
import { useEffect, useState } from "react";
import { Book, Filters } from "@/types/types";
import {  fetchUniqueValues } from "@/utils/fetchUniqueValues";
import { SearchContext } from "./context";
import ColorCircles from "@/utils/ColorCircles";

const CatalogPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const allGenres  =   fetchUniqueValues('genres');
  const allCateories  =   fetchUniqueValues('category');

  useEffect(() => {
    async function update() {
      try {
        const newBooks = await getBooksByQuery();
        setBooks(newBooks);
      } catch (error) {
        setError("Failed to load books.");
      } finally {
        setIsLoading(false);
      }
    }
    update();
  }, []);

  if (isLoading) {
    return (
      <Box
        className="w-full flex justify-center items-center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className="w-full flex justify-center items-center"
        style={{ height: "100vh" }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <SearchContext.Provider
      value={{
        isOpenSearcher,
        setOpenSearcher,
        filters,
        setFilters,
        books,
        setBooks,
        genres : allGenres,
        categories: allCateories
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
        <BookCatalog   />
        <Searcher />
        <ColorCircles />
      </Box>
    </SearchContext.Provider>
  );
};

export default CatalogPage;
