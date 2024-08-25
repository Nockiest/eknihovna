"use client";
import BookCatalog from "@/components/katalog/BookCatalog";
import { Box, Typography, CircularProgress, Checkbox } from "@mui/material";
import {   useMemo, useState } from "react";
import { Book, Filters, FiltringValues } from "@/types/types";
import { SearchContext } from "./context";
import { Searcher } from "@/components/katalog/Searcher";
import axios from "axios";
// import { genUniqueBookCount } from "@/utils/apiConections/getBookCount";
import ErrorReporter from "@/theme/Announcer";

const KatalogPage = () => {
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    author: [],
    category: [],
    genres: [],
    formaturita: null,
    available: false,
    name: null
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterValues, setFiltersValues] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
    name: []
  });
  const [query, setQuery] = useState<string  >('');

  if (errorMessage) {
    return <ErrorReporter message={errorMessage}  type='error'/>;
  }

  return (
    <SearchContext.Provider
      value={{
        isOpenSearcher,
        setOpenSearcher,
        filters, // currently active filters
        setFilters,
        errorMessage, //
        setErrorMessage,
        filterValues, // possible filter values
        setFiltersValues,
      }}
    >
      <Box className="w-full">
        <Box
          display="flex"
          alignItems="space-between"
          justifyContent={"center"}
        >
          <Typography className="mx-auto text-center mb-3" variant={"h2"}>
            Katalog
          </Typography>
        </Box>
        <BookCatalog />
        <Searcher />
      </Box>
    </SearchContext.Provider>
  );
};

export default KatalogPage;
