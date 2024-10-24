"use client";
import BookCatalog from "@/components/katalog/BookCatalog";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Filters, FiltringValues } from "@/types/types";
import { SearchContext } from "./context";
import ErrorReporter from "@/utils/Announcer";
import fetchUniqueValues from "@/utils/apiConections/fetchUniqueValues";
import CreditMe from "@/components/general/CreditMe";
import { usePathname, useRouter,useSearchParams } from "next/navigation";

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
  const [filterValues, setFiltersValues] = useState<FiltringValues>({
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
    setFiltersValues((prevFilters: FiltringValues) => ({
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

  const handleActiveFilterChange = (
    filterName: keyof Filters,
    value: string | boolean | null
  ) => {
    console.log(filterName, value);
    const makeNewFilters = () => {
      if (
        (typeof value === "boolean" || value === null) &&
        !Array.isArray(activeFilters[filterName])
      ) {
        return {
          ...activeFilters,
          [filterName]: !value ? null : value,
        };
      }
      if (Array.isArray(activeFilters[filterName])) {
        const arrayValue = activeFilters[filterName] as string[];
        if (
          typeof value === "boolean" ||
          value === null ||
          value === undefined
        ) {
          console.error("value has unexpected value: " + value);
          return {
            ...activeFilters,
            [filterName]: [],
          };
        }

        if (!arrayValue.includes(value)) {
          return {
            ...activeFilters,
            [filterName]: [...arrayValue, value],
          };
        } else {
          return activeFilters;
        }
      } else {
        return {
          ...activeFilters,
          [filterName]: value,
        };
      }
    };
    const newFilters = makeNewFilters();
    setActiveFilters(newFilters);
    changePage(1)
  };

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const pathname = usePathname();
  const router = useRouter();
  const changePage = (newPage: number) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("page", newPage.toString());
    router.push(`${pathname}?${currentQuery.toString()}`);
  };

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
        setFiltersValues,
        handleActiveFilterChange
      }}
    >
      <Box className="w-full px-3 md:px-12">
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
