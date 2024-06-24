"use client";

import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, useTheme,useMediaQuery, Breakpoint } from "@mui/material";
import { Book } from "@/types/types";
import BookPreview from "./BookPreview";
import DotsShower from "./DotsShower";
import { usePathname } from "next/navigation";
import PaginationLinker from "./PaginationLinker";
import { getURLSegment } from "@/utils/getURLSegment";
import useCurrentBreakpoint from "@/utils/useCustomBreakpoint";

interface BookCatalogProps {
  promisedBooks: Promise<Book[]> | Book[];
}

const shownBooksBySize: Record<Breakpoint, number>  = {
  'xs' : 12,
  'sm' : 12,
  'md' : 24,
  'lg' : 36,
  'xl' : 36
}

const BookCatalog: React.FC<BookCatalogProps> = ({ promisedBooks }) => {
  const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  // const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))
  const size = useCurrentBreakpoint()
  const [itemsPerPage, setItemsPerPage] = useState<number>(12); // should think about what to do with the url when this val changes
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const currentPage = parseInt(getURLSegment(pathname, 2), 10) || 1;
  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const totalPages = Math.ceil(allBooks.length / itemsPerPage);
  useEffect(() => {
    if (size) {

      setItemsPerPage(shownBooksBySize[size]);
      console.log('size changed')
    }
    // if (isSmallScreen) {
    //   setItemsPerPage(12);
    // } else if (isMediumScreen) {
    //   setItemsPerPage(24);
    // } else if (isLargeScreen) {
    //   setItemsPerPage(36);
    // }
  }, [size]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const resolvedBooks = await promisedBooks;
        setAllBooks(resolvedBooks);
      } catch (err: any) {
        setError(err.message || "Failed to fetch books");
      }
    };
    fetchBooks();
  }, [promisedBooks]);

  useEffect(() => {
    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooksSlice = allBooks.slice(indexOfFirstBook, indexOfLastBook);
    setShownBooks(currentBooksSlice);
  }, [currentPage,   allBooks]);

  if (error) {
    return (
      <div>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <Box className='w-full'>
      {shownBooks.length > 0 ? (
        <div className='w-full'>
       <Grid container spacing={2} columns={12}  >
       {shownBooks.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
