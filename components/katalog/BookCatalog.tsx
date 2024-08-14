"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { getBooksByQuery } from "@/utils/apiConections/fetchBooks";
import FilterOverview from "./FilterOverview";
import { queryBookName } from "@/utils/apiConections/queryBookName";
import getRelevancy from "@/utils/searchingUtils";
import SearchAutocomplete from "./SearchBar";
import SearcherOpenerFab from "./SearcheOpenerFab";
import FilterLister from "./FilterLister";
import { shownBooksBySize } from "@/data/values";

interface BookCatalogProps {}


const BookCatalog: React.FC<BookCatalogProps> = () => {
  // const size = useCurrentBreakpoint() || "xs";
  const router = useRouter();
  const pathname = usePathname();
  const {
    isOpenSearcher,
    setOpenSearcher,
    filters,
    bookNames,
    setIsLoading,
    setErrorMessage
  } = useSearchContext();

  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const [BooksInFilterNum, setBooksInFilterNum] = useState<number>(0);
  const searchParams = useSearchParams();
  const page =
    parseInt(searchParams.get("page") || "1", 10) === 0
      ? 1
      : parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const getStartAndEndIndexes = (page: number, itemsPerPage: number) => {
    const indexOfFirstBook = page * itemsPerPage - itemsPerPage;
    const newLastBookIndex = page * itemsPerPage;
    return [indexOfFirstBook, newLastBookIndex];
  };


  // set visible books from filtered books
  // useEffect(() => {
  //   changePage(1);
  //   const [startIndex, endIndex] = getStartAndEndIndexes(
  //     1,
  //     shownBooksBySize[size]
  //   );
  //   const visibleBooks = filteredBooks
  //     .filter((book: Book) => getRelevancy(book.name, query))
  //     .slice(startIndex, endIndex);
  //   console.log(startIndex, endIndex, visibleBooks, filteredBooks.length,filters);
  //   setShownBooks(visibleBooks);
  // }, [filteredBooks, page, router, query, size]);


  // fetch books by filter
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const newBooks = await getBooksByQuery(filters, page, 24 ); //shownBooksBySize[size]
        const allPossibleBooks = await getBooksByQuery(filters, );
        setBooksInFilterNum ( allPossibleBooks.length)
        // setFilteredBooks(newBooks);
        setShownBooks(newBooks);
      } catch (err: any) {
        console.log(err?.message);
        setErrorMessage(err?.message || "unknown error occurred");
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [filters,page  ]);
//filters, query, page, size,
  // useEffect(() => {
  //   changePage(1); // reset page number on every query
  //   setFilteredBooks((prev) =>
  //     prev.filter((book: Book) => getRelevancy(book.name, query))
  //   );
  // }, [query, filters]);

  // Memoize the shownBooks to avoid unnecessary recalculations
  // const memoizedShownBooks = useMemo(() => shownBooks, [shownBooks]);

  // Update page on resize
  // useEffect(() => {
  //   if (size) {
  //     const newItemsPerPage = shownBooksBySize[size];
  //     const pageNum = page === 0 ? 1 : page;
  //     const [indexOfFirstBook] = getStartAndEndIndexes(
  //       pageNum,
  //       newItemsPerPage
  //     );
  //     const newCurrentPage = Math.ceil(indexOfFirstBook / newItemsPerPage);
  //     router.push(
  //       `/katalog?page=${Math.min(
  //         Math.ceil(
  //           typeof totalBookNum === "number"
  //             ? totalBookNum
  //             : 0 / newItemsPerPage
  //         ),
  //         newCurrentPage + 1 || 1
  //       )}`
  //     );
  //   }
  // }, [size, totalBookNum, router, page]);



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

      {shownBooks.length > 0 ? (
        <Box className="w-full">
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
                alignItems={"center"}
              >
                <BookPreview book={book} />
              </Grid>
            ))}
          </Grid>
          <PaginationLinker
          totalEntries ={ BooksInFilterNum}
            itemsPerPage={24} //shownBooksBySize[size]
            folderName="katalog"
          />
        </Box>
      ) : (
        <Typography variant="h6" sx={{ margin: "2rem" }}>
          Žádné knihy nenalezeny
        </Typography>
      )}
    </Box>
  );
};

export default BookCatalog;
// Fetch books on initial render
// useEffect(() => {
//   console.log('run')
//   router.push("/katalog?page=1"); // reset page number on every query
// }, [filters, router]);
// Update shown books based on currentPage and itemsPerPage
// useEffect(() => {
//   setNewBookSlice(page, shownBooksBySize[size], allBooks);
// }, [page, router, size, allBooks]);

// const setNewBookSlice = (
//   page: number,
//   itemsPerPage: number,
//   totalBooks: Book[] | undefined
// ) => {
//   const [indexOfFirstBook, newLastBookIndex] = getStartAndEndIndexes(
//     page,
//     itemsPerPage
//   );
//   setShownBooks(
//     allBooks === undefined
//       ? []
//       : allBooks?.slice(indexOfFirstBook, newLastBookIndex)
//   );
// };

//   useEffect(() =>{
//     async function fetchBoo()   {
//       try {
//         const newBooks = await getBooksByQuery(filters);
//         // setBooks(newBooks);

//       } catch (error) {
//     }
//   }
//   fetchBoo()
// } ,[filters])

// const fetchBooks = async () => {
//   try {
//     // const resolvedBooks = await books;
//     // console.log(resolvedBooks);
//     // setAllBooks(
//     //   resolvedBooks.filter((book) => {
//     //     if (book && book.name) {
//     //       return getRelevancy(book.name, query);
//     //     }
//     //     return false;
//     //   })
//     // );
//   } catch (err: any) {
//     setError(err.message || "Failed to fetch books");
//   }
// };

// fetchBooks();
