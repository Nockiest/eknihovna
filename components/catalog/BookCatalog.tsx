"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Breakpoint,
  Autocomplete,
  TextField,
  styled,
} from "@mui/material";
import { Book, Filters } from "@/types/types";
import BookPreview from "./BookPreview";
import DotsShower from "../general/DotsShower";
import PaginationLinker from "../general/PaginationLinker";
import { getURLSegment } from "@/utils/getURLSegment";
import useCurrentBreakpoint from "@/utils/useCustomBreakpoint";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoryChip from "./CategoryChip";
import { useSearchContext } from "@/app/katalog/context";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { getBooksByQuery } from "@/utils/fetchBooks";
import FilterOverview from "./FilterOverview";
import { queryBookName } from "@/utils/queryBookName";
import getRelevancy from "@/utils/searchingUtils";
import SearchAutocomplete from "./SearchBar";

interface BookCatalogProps {}

const shownBooksBySize: Record<Breakpoint, number> = {
  xs: 12,
  sm: 12,
  md: 24,
  lg: 36,
  xl: 36,
};


const BookCatalog: React.FC<BookCatalogProps> = () => {
  const theme = useTheme();
  const size = useCurrentBreakpoint() || "xs";
  const router = useRouter();
  const { books,bookNames, setBooks, filters, setFilters, query, setQuery } =
    useSearchContext();

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const getStartAndEndIndexes = (page: number, itemsPerPage: number) => {
    const indexOfFirstBook = page * itemsPerPage - itemsPerPage;
    const newLastBookIndex = page * itemsPerPage;
    return [indexOfFirstBook, newLastBookIndex];
  };

  const setNewBookSlice = (
    page: number,
    itemsPerPage: number,
    allBooks: Book[] | undefined
  ) => {
    const [indexOfFirstBook, newLastBookIndex] = getStartAndEndIndexes(
      page,
      itemsPerPage );
    setShownBooks(
      allBooks === undefined
        ? []
        : allBooks?.slice(indexOfFirstBook, newLastBookIndex)
    );
  };

  useEffect(() => {
    if (size) {
      const newItemsPerPage = shownBooksBySize[size];
      const [indexOfFirstBook] = getStartAndEndIndexes(page, newItemsPerPage);
      const newCurrentPage = Math.ceil(indexOfFirstBook / newItemsPerPage);
      setNewBookSlice(page, newItemsPerPage, allBooks);
      router.push(
        `/katalog?page=${Math.min(
          Math.ceil(allBooks.length / newItemsPerPage),
          newCurrentPage + 1 || 1
        )}`
      );
    }
  }, [size, allBooks, router, page]);

  // Fetch books on initial render
  useEffect(() => {
    router.push('/katalog?page=1'); // reset page number on every query

    const fetchBooks = async () => {
      try {
        const resolvedBooks = await books;
        console.log(resolvedBooks);
        setAllBooks(
          resolvedBooks.filter((book) => {
            if (book && book.name) {
              return  getRelevancy(book.name, query)
            }
            return false;
          })
        );
      } catch (err: any) {
        setError(err.message || 'Failed to fetch books');
      }
    };

    fetchBooks();
  }, [books, query, router]);

  // Update shown books based on currentPage and itemsPerPage
  useEffect(() => {
    setNewBookSlice(page, shownBooksBySize[size], allBooks);
  }, [page, router, size, allBooks]);

  if (error) {
    return (
      <div>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  const removeFilter = (key: keyof Filters, value: string) => {
    setFilters((prevFilters: Filters) => {
      const currentFilter = prevFilters[key];

      if (Array.isArray(currentFilter)) {
        // Remove the specified value from the array
        const updatedArray = currentFilter.filter(
          (item: string) => item !== value
        );
        return {
          ...prevFilters,
          [key]: updatedArray.length > 0 ? updatedArray : null,
        };
      } else {
        // Set the value under the key to null
        return {
          ...prevFilters,
          [key]: null,
        };
      }
    });
  };

  return (
    <Box className="w-full">
      {/* <FilterOverview removeFilter={removeFilter} /> */}


    <SearchAutocomplete onInputChange={(e)=>setQuery(e)} bookNames={bookNames} />
      {shownBooks.length > 0 ? (
        <div className="w-full">
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
  {shownBooks.map((book, index) => (
    <Grid
      sx={{
        margin: "0 auto",
        height: "auto",
        flexGrow: "1",
        display: "flex",
        justifyContent: "center",
      }}
      item
      xs={12}
      sm={6}
      md={4}
      xl={3}
      key={index}
      alignItems={'center'}

    >
      <BookPreview book={book} />
    </Grid>
  ))}
</Grid>


          <PaginationLinker
            allItems={allBooks}
            itemsPerPage={shownBooksBySize[size]}
            folderName="katalog"
          />
        </div>
      ) : (
        <Typography variant="h6">Žádné knihy nenalezeny</Typography>
      )}
    </Box>
  );
};

export default BookCatalog;
