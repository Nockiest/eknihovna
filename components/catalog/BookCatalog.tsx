"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, useTheme, Breakpoint } from "@mui/material";
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
  const { books, setBooks, filters, setFilters } = useSearchContext();

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
      itemsPerPage
    );
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
    router.push(`/katalog?page=1`); // reset page number on every query
    const fetchBooks = async () => {
      try {
        const resolvedBooks = await books;
        setAllBooks(resolvedBooks);
      } catch (err: any) {
        setError(err.message || "Failed to fetch books");
      }
    };
    fetchBooks();
  }, [books, router]);

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

  const removeFilter = (key: string) => {
    console.log(filters);
    setFilters((prevFilters: Filters) => {
      const { [key]: removedKey, ...rest } = prevFilters;
      return rest;
    });
  };

  return (
    <Box className="w-full">
      <FilterOverview removeFilter={removeFilter} />
      {shownBooks.length > 0 ? (
        <div className="w-full">
          <Grid
            container
            spacing={2}
            columns={12}
            alignItems="center"
            sx={{justifyContent: "center",alignItems: "center",}}
          >
            {shownBooks.map((book, index) => (
              <Grid sx={{margin:'0 auto', height: 'auto'}} item xs={12} sm={6} md={4} xl={3} key={index}>
                <BookPreview  book={book} />
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
<Typography variant='h6' >Žádné knihy nenalezeny</Typography>
)}
    </Box>
  );
};

export default BookCatalog;
