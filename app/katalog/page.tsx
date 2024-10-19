"use client";
import BookCatalog from "@/components/katalog/BookCatalog";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Filters, FiltringValues } from "@/types/types";
import { SearchContext } from "./context";
import ErrorReporter from "@/utils/Announcer";
import fetchUniqueValues from "@/utils/apiConections/fetchUniqueValues";
import CreditMe from "@/components/general/CreditMe";

// provides contex for the while page
const KatalogPage = () => {
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    author: [],
    category: [],
    genres: [],
    formaturita: false,
    available: false,
    name: null,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterValues, setActiveFiltersValues] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
    name: [],
  });

  async function fetchUniqueFilterCol(
    colName: "genres" | "category" | "author"|'name'
  ) {

    const res = await fetchUniqueValues(colName);
    console.log('fetch unique vals:',colName, res)
    setActiveFiltersValues((prevFilters: FiltringValues) => ({
      ...prevFilters,
      [colName]: res,
    }));
  }

// maybe ineffective?
  useEffect(() => {
    async function update() {
      try {
        await Promise.all([
          fetchUniqueFilterCol("genres"),
          fetchUniqueFilterCol("category"),
          fetchUniqueFilterCol("author"),
          fetchUniqueFilterCol("name"),
        ]);
      } catch (error) {
        setErrorMessage("Failed to load books.");
      }
    }
    update();
  }, []);


  if (errorMessage) {
    return <ErrorReporter message={errorMessage} type="error" />;
  }

  return (
    <SearchContext.Provider
      value={{
        isOpenSearcher,
        setOpenSearcher,
        activeFilters, // currently active activeFilters
        setActiveFilters,
        errorMessage, //
        setErrorMessage,
        filterValues, // possible filter values
        setActiveFiltersValues,
      }}
    >
      <Box className="w-full px-12">
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
        <CreditMe />
      </Box>
    </SearchContext.Provider>
  );
};

export default KatalogPage;
