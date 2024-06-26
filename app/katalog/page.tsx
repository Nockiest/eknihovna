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

// Define the context type
// type QueryContextType = {
//   isOpenSearcher: boolean;
//   setOpenSearcher: React.Dispatch<React.SetStateAction<boolean>>;
//   filters: Filters;
//   setFilters: React.Dispatch<React.SetStateAction<Filters>>;
//   books: Book[];
//   setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
// };

// // Create the context
// const SearchContext = createContext<QueryContextType | undefined>(undefined);

// // Custom hook to use the SearchContext
// export const useSearchContext = () => {
//   const context = useContext(SearchContext);

//   if (!context) {
//     throw new Error(
//       "useSearchContext must be used within a SearchContextProvider"
//     );
//   }

//   return context;
// };
//const  books =  getBooksByQuery()
const CatalogPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isOpenSearcher, setOpenSearcher] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    genre: "",
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
