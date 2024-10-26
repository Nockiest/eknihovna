"use client";
import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Grid, IconButton, Stack } from "@mui/material";
import { Book, Filters } from "@/types/types";
import BookPreview from "./BookPreview";
import PaginationLinker from "../general/PaginationLinker";
import { useSearchParams } from "next/navigation";
import { useSearchContext } from "@/app/katalog/context";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import SearcherOpenerFab from "./SearcheOpenerFab";
import FilterLister from "./FilterLister";
import LoadingComponent from "../general/LoadingComponent";
import Announcer from "@/utils/Announcer";
import { FiltringWindow } from "./FiltringWindow";
import SortedGroupedSelect from "./SortedSelect";
import SearchIcon from "@mui/icons-material/Search";
import getFilteredOptions from "@/utils/getFilteredOptions";
import catchError from "@/utils/catchError";
type State = {
  status: "loading" | "loadedBooks" | "error";
  shownBooks: Book[];
  BooksInFilterNum: number;
  errorMessage: string | null;
};

type Action =
  | { type: "FETCH_INIT" }
  | { type: "FETCH_SUCCESS"; payload: { books: Book[]; totalBooks: number } }
  | { type: "FETCH_FAILURE"; errorMessage: string };

const initialState: State = {
  status: "loading",
  shownBooks: [],
  BooksInFilterNum: 0,
  errorMessage: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        status: "loading",
        errorMessage: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        status: "loadedBooks",
        shownBooks: action.payload.books,
        BooksInFilterNum: action.payload.totalBooks,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        status: "error",
        errorMessage: action.errorMessage,
      };
    default:
      throw new Error(`Unhandled action type: `);
  }
}

// handles fetching and displaying books
const BookCatalog: React.FC = () => {
  const {
    isOpenSearcher,
    setOpenSearcher,
    activeFilters,
    filterValues,
    handleActiveFilterChange,
  } = useSearchContext();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentSearchValue, setCurrentSearchValue] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  const fetchBooks = async () => {

      const logic = async () => {
        dispatch({ type: "FETCH_INIT" });

        // try {
          const allPossibleBooks = await fetchFilteredBooks(activeFilters);
          console.log("All filtered books:", allPossibleBooks.length);

          // Calculate the current page's books using the offset
          const startIndex = (page - 1) * 24;
          const endIndex = startIndex + 24;
          const currentBooks = allPossibleBooks.slice(startIndex, endIndex);
          console.log(
            allPossibleBooks.length,
            currentBooks.length,
            startIndex,
            endIndex
          );
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              books: currentBooks,
              totalBooks: allPossibleBooks.length,
            },
          });
      }
    const [error, res] = await catchError(logic());
    if (error) {
      console.log(error?.message);
      dispatch({
        type: "FETCH_FAILURE",
        errorMessage: error?.message || "Unknown error occurred",
      });
    }
  };
  // should fetch only books based on page
  useEffect(() => {
    fetchBooks();
  }, [page, activeFilters]);

  const { status, shownBooks, BooksInFilterNum, errorMessage } = state;

  return (
    <Box className="w-full">
      <FilterLister />
      <Box className="flex flex-row flex-wrap w-full p-4 bg-primary-950 gap-4">
        <SearcherOpenerFab
          css={"z-0 mb-2"}
          onClick={() => setOpenSearcher(!isOpenSearcher)}
        />
        <IconButton>
          <SearchIcon onClick={() => handleActiveFilterChange("name", currentSearchValue)}/>
        </IconButton>
        <SortedGroupedSelect
          options={getFilteredOptions('name', filterValues, activeFilters)}
          label={"Vyhledat"}
          handleChange={(newVal) => {
            setCurrentSearchValue(newVal)
            handleActiveFilterChange("name", newVal)}}
          handleInputChange={(newVal) => setCurrentSearchValue(newVal)}
          // useUserInputedValue=
        />
      </Box>
      <FiltringWindow />

      {status === "loading" && <LoadingComponent />}

      {status === "error" && (
        <Announcer message={errorMessage} type={"error"} />
      )}

      {status === "loadedBooks" && shownBooks.length > 0 && (
        <Stack className="w-full mx-auto">
          <Grid
            container
            spacing={4}
            columns={12}
            alignItems="stretch"
            sx={{
              justifyContent: "center",
              width: "100%",
              display: "flex",
              alignItems: "center",
              margin: "1rem auto",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {shownBooks.map((book: Book, index: any) => (
              <Grid
                className="  relative  w-full h-auto"
                item
                xs={6}
                sm={4}
                md={3}
                lg={2}
                xl={1}
                key={index}
                alignItems={"begin"}
              >
                <BookPreview book={book} />
              </Grid>
            ))}
          </Grid>
          <PaginationLinker
            totalEntries={BooksInFilterNum}
            itemsPerPage={24}
            folderName="katalog"
          />
        </Stack>
      )}

      {status === "loadedBooks" && shownBooks.length === 0 && (
        <Announcer message={"Žádné knihy nenalezeny"} type={"error"} />
      )}
    </Box>
  );
};

export default BookCatalog;
