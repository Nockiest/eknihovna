"use client";
import BookCatalog from "@/components/katalog/BookCatalog";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { Filters, FiltringValues } from "@/types/types";
import { SearchContext } from "./context";
import { FiltringWindow } from "@/components/katalog/FiltringWindow";
import ErrorReporter from "@/utils/Announcer";
import ColorCirclesComprehensive from "@/components/general/styling/ColorCirclesComprehensive";

const KatalogPage = () => {
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [activeFilters, setFilters] = useState<Filters>({
    author: [],
    category: [],
    genres: [],
    formaturita: false,
    available: false,
    name: null,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterValues, setFiltersValues] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
    name: [],
  });

  if (errorMessage) {
    return <ErrorReporter message={errorMessage} type="error" />;
  }

  return (
    <SearchContext.Provider
      value={{
        isOpenSearcher,
        setOpenSearcher,
        activeFilters, // currently active activeFilters
        setFilters,
        errorMessage, //
        setErrorMessage,
        filterValues, // possible filter values
        setFiltersValues,
      }}
    >
      {/* <ColorCirclesComprehensive /> */}
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
        <FiltringWindow />
      </Box>
    </SearchContext.Provider>
  );
};

export default KatalogPage;
