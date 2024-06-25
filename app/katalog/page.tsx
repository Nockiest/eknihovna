"use client";

import BookCatalog from "@/components/catalog/BookCatalog";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Typography } from "@mui/material";
import Searcher from "@/components/catalog/Searcher";
import SearcherOpenerFab from "@/components/catalog/SearcheOpenerFab";
import { createContext, useContext, useState } from "react";
import { Filters } from "@/types/types";

// Define the context type
type QueryContextType = {
  isOpenSearcher: boolean;
  setOpenSearcher: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

// Create the context
export const SearchContext = createContext<QueryContextType | undefined>(undefined);

// Custom hook to use the SearchContext
export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }

  return context;
};

const CatalogPage = () => {
  const books = getBooksByQuery();
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
     name: '',
    genre: '',
    available: false,
    forMaturita: false
  });

  return (
    <SearchContext.Provider value={{ isOpenSearcher, setOpenSearcher,filters, setFilters  }}>
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

        <Searcher  />
      </Box>
    </SearchContext.Provider>
  );
};

export default CatalogPage;
