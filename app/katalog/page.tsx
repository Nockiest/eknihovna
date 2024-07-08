"use client";
import BookCatalog from "@/components/catalog/BookCatalog";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box, Typography, CircularProgress, Checkbox } from "@mui/material";
import SearcherOpenerFab from "@/components/catalog/SearcheOpenerFab";
import { useEffect, useMemo, useState } from "react";
import { Book, Filters, FiltringValues } from "@/types/types";
import { fetchUniqueValues } from "@/utils/fetchUniqueValues";
import { SearchContext } from "./context";
import ColorCircles from "@/utils/ColorCircles";
import { Searcher } from "@/components/catalog/Searcher";
import axios from "axios";
import { genUniqueBookCount } from "@/utils/getBookCount";
import { getBookNames } from "@/utils/getBookNames";

const KatalogPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    author: [],
    category: [],
    genres: [],
    formaturita: null,
    available: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterValues, setFiltersValues] = useState<FiltringValues>({
    genres: [],
    category: [],
    author: [],
  });
  // const [query, setQuery] = useState<string  >('');
  const [ bookNames,setBookNames] = useState<string[]>([]) //useMemo(() => getBookNames(), []);
  const [totalBookNum, setTotalBookNum] = useState<number >(0)
  //= useMemo(() => genUniqueBookCount(), []);
  async function fetchUniqueFilterCol(
    colName: "genres" | "category" |  "author"
  ) {
    const res = await fetchUniqueValues(colName);
    setFiltersValues((prevFilters: FiltringValues) => ({
      ...prevFilters,
      [colName]: res,
    }));
  }

  useEffect(() => {
    async function update() {
      try {

        const newBooks = await getBooksByQuery();
        const  bookNames =  await fetchUniqueValues('name')
        setTotalBookNum(bookNames.length)
        setBooks(newBooks);
        setBookNames(bookNames);
        await Promise.all([
          fetchUniqueFilterCol("genres"),
          fetchUniqueFilterCol("category"),
          fetchUniqueFilterCol("author"),
        ]);
      } catch (error) {
        setError("Failed to load books.");
      } finally {
        setIsLoading(false);
      }
    }
    update();
  }, [ ]);


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
        filters, // currently active filters
        setFilters,
        totalBookNum,
        books,
        // setBooks,
        filterValues, // possible filter values

        bookNames,
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
        {/* <ColorCircles /> */}
      </Box>
    </SearchContext.Provider>
  );
};

export default KatalogPage;
