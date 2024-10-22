"use client";
import React, { useEffect, useReducer } from "react";
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
    handleActiveFilterChange,
  } = useSearchContext();
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  const fetchBooks = async () => {
    dispatch({ type: "FETCH_INIT" });

    try {
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
      // Dispatch the result to the state
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          books: currentBooks,
          totalBooks: allPossibleBooks.length,
        },
      });
    } catch (err: any) {
      console.log(err?.message);
      dispatch({
        type: "FETCH_FAILURE",
        errorMessage: err?.message || "Unknown error occurred",
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
          <SearchIcon />
        </IconButton>
        <SortedGroupedSelect
          filterName={"name"}
          label={"název"}
          handleChange={(newVal) => handleActiveFilterChange("name", newVal)}
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
                className="flex justify-center items-center flex-grow m-0 mx-auto h-auto"
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
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
