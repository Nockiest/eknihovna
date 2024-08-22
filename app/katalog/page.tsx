"use client";
import BookCatalog from "@/components/katalog/BookCatalog";
import { Box, Typography,  Checkbox } from "@mui/material";
import { useEffect,   useState } from "react";
import { Book, Filters, FiltringValues } from "@/types/types";
import { Searcher } from "@/components/katalog/Searcher";
import ErrorReporter from "@/theme/Announcer";
import { SearchContext } from "./context";

const KatalogPage = () => {
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    author: [],
    category: [],
    genres: [],
    formaturita: null,
    available: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterValues, setFiltersValues] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
  });
  const [query, setQuery] = useState<string  >('');
  const [bookNames, setBookNames] = useState<string[]>([]);



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
        // totalBookNum,
        errorMessage, //
        setErrorMessage,
        setBookNames,
        // books,
        // setBooks,
        filterValues, // possible filter values
        setFiltersValues,
        bookNames,
        query,
        setQuery,
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
