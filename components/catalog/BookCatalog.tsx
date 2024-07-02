"use client";
import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, useTheme, Breakpoint } from "@mui/material";
import { Book } from "@/types/types";
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
  const size = useCurrentBreakpoint();
  const router = useRouter();
  const { books, setBooks, filters, setFilters } = useSearchContext();

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const setNewBookSlice = (
    page: number,
    itemsPerPage: number,
    allBooks: Book[] | undefined
  ) => {
    const indexOfFirstBook = page * itemsPerPage - itemsPerPage;
    const newLastBookIndex = page * itemsPerPage;
    console.log(allBooks, allBooks === undefined);
    setShownBooks(
      allBooks === undefined
        ? []
        : allBooks?.slice(indexOfFirstBook, newLastBookIndex)
    );
  };
  useEffect(() => {
    if (size) {
      const indexOfFirstBook = page * itemsPerPage - itemsPerPage;
      const newItemsPerPage = shownBooksBySize[size];
      setItemsPerPage(newItemsPerPage);
      const newCurrentPage = Math.ceil(indexOfFirstBook / newItemsPerPage);
      setNewBookSlice(page, itemsPerPage, allBooks);
      setTotalPages((prev) => {
        return allBooks === undefined
          ? 0
          : Math.ceil(allBooks.length / itemsPerPage);
      });
      router.push(
        `/katalog?page=${Math.min(
          Math.ceil(allBooks.length / itemsPerPage),
          newCurrentPage + 1 || 1
        )}`
      );
    }
  }, [size, allBooks, itemsPerPage, page]);

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
  }, [books]);

  // Update shown books based on currentPage and itemsPerPage
  useEffect(() => {
    setNewBookSlice(page, itemsPerPage, allBooks);
    setTotalPages((prev) => {
      return allBooks === undefined
        ? 0
        : Math.ceil(allBooks.length / itemsPerPage);
    });
  }, [page, itemsPerPage, allBooks]);

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
    setFilters((prevFilters) => {
      const { [key]: removedKey, ...rest } = prevFilters;
      return rest;
    });
  };

  return (
    <Box className="w-full">
      <Box>
        {Object.entries(filters).map(([key, value], index) => (
          <CategoryChip
            key={index}
            text={key}
            onRemove={() => removeFilter(key)}
          />
        ))}
        <PrimaryButton
          onClick={async () => {
            const newBooks = await getBooksByQuery(filters);
            setBooks(newBooks);
          }}
        >
          Použít Filtry
        </PrimaryButton>
      </Box>

      {shownBooks.length > 0 ? (
        <div className="w-full">
          <Grid container spacing={2} columns={12}>
            {shownBooks.map((book, index) => (
              <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                <BookPreview book={book} />
              </Grid>
            ))}
          </Grid>

          <PaginationLinker totalPages={totalPages} folderName="katalog" />
        </div>
      ) : (
        <DotsShower />
      )}
    </Box>
  );
};

export default BookCatalog;
