"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Book } from "@/types/types";
import BookPreview from "./BookPreview";
import DotsShower from "./DotsShower";
import { usePathname  } from "next/navigation";
import PaginationLinker from "./PaginationLinker";
import { getLastURLSegment } from "@/utils/getLastUrlSegment";

interface BookCatalogProps {
  promisedBooks: Promise<Book[]> | Book[];
}
const BookCatalog: React.FC<BookCatalogProps> = ({ promisedBooks }) => {
  const itemsPerPage = 10;
  const [allbooks, setAllbooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentPage = parseInt(getLastURLSegment(usePathname()), 10);
  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const totalPages = Math.ceil(allbooks?.length / itemsPerPage);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('awaiting books')
        const resolvedBooks = await promisedBooks;
        setAllbooks(resolvedBooks);
      } catch (err ) {
        throw new Error("error fetching" + err);
        // setError(err?.message || "Failed to fetch books");
      }
    };
    console.log('fetching books')
    fetchBooks();
  }, [promisedBooks]);

  useEffect(() => {
    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooksSlice = allbooks?.slice(indexOfFirstBook, indexOfLastBook);
    setShownBooks(currentBooksSlice);
  }, [currentPage, allbooks]);

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
    <div>
      { shownBooks.length > 0 ? (
        <div>
          {shownBooks.map((book, index) => (
            <BookPreview key={index} book={book} />
          ))}
          <PaginationLinker totalPages={totalPages} folderName="katalog" />
        </div>
      ) : (
        <DotsShower />
      )}
    </div>
  );
};

export default BookCatalog;
