"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Book } from "@/types/types";
import BookPreview from "./BookPreview";
import DotsShower from "./DotsShower";
import { usePathname } from "next/navigation";
import PaginationLinker from "./PaginationLinker";
import { getURLSegment } from "@/utils/getURLSegment";

interface BookCatalogProps {
  promisedBooks: Promise<Book[]> | Book[];
}

const BookCatalog: React.FC<BookCatalogProps> = ({ promisedBooks }) => {
  const itemsPerPage = 10;
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const currentPage = parseInt(getURLSegment(pathname, 2), 10) || 1;
  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const totalPages = Math.ceil(allBooks.length / itemsPerPage);

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
  }, [currentPage, allBooks]);

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
    <Box>
      {shownBooks.length > 0 ? (
        <div>
          {shownBooks.map((book, index) => (
            <BookPreview key={index} book={book} />
          ))}
          <div>

            <PaginationLinker totalPages={totalPages} folderName="katalog" />
          </div>
        </div>
      ) : (
        <DotsShower />
      )}
    </Box>
  );
};

export default BookCatalog;
