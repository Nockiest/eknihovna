"use client";
import React, { useEffect, useReducer } from "react";
import { Box, Grid } from "@mui/material";
import { Book  } from "@/types/types";
import BookPreview from "./BookPreview";
import PaginationLinker from "../general/PaginationLinker";
import { useSearchParams } from "next/navigation";
import { useSearchContext } from "@/app/katalog/context";
import { getBooksByQuery } from "@/utils/apiConections/fetchBooks";
import SearchAutocomplete from "./SearchBar";
import SearcherOpenerFab from "./SearcheOpenerFab";
import FilterLister from "./FilterLister";
import LoadingComponent from "../general/LoadingComponent";
import Announcer from "@/theme/Announcer";

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

const BookCatalog: React.FC = () => {
  const { isOpenSearcher, setOpenSearcher, filters } = useSearchContext();
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        const newBooks = await getBooksByQuery(filters, page, 24);
        const allPossibleBooks = await getBooksByQuery(filters);
        console.log(
          "all books and shown books",
          allPossibleBooks.length,
          newBooks.length
        );

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            books: newBooks,
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

    fetchBooks();
  }, [filters, page]);

  const { status, shownBooks, BooksInFilterNum, errorMessage } = state;

  return (
    <Box className="w-full">
      <FilterLister />
      <Box className="flex-row flex-wrap w-full gap-4">
        <SearcherOpenerFab
          css={"z-0 mb-2"}
          onClick={() => setOpenSearcher(!isOpenSearcher)}
        />
        <SearchAutocomplete />
      </Box>

      {status === "loading" && <LoadingComponent />}

      {status === "error" && (
        <Announcer message={errorMessage} type={"error"} />
      )}

      {status === "loadedBooks" && shownBooks.length > 0 && (
        <Box className="w-full mx-auto">
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
                className="flex justify-center items-center flex-grow m-0 h-auto"
                item
                xs={12}
                sm={6}
                md={4}
                xl={3}
                key={index}
                alignItems={"center"}
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
        </Box>
      )}

      {status === "loadedBooks" && shownBooks.length === 0 && (
        <Announcer message={"Žádné knihy nenalezeny"} type={"error"} />
      )}
    </Box>
  );
};

export default BookCatalog;