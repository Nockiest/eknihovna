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
import { getBooksByQuery } from "@/utils/fetchBooks";
import FilterOverview from "./FilterOverview";
import { queryBookName } from "@/utils/queryBookName";
import getRelevancy from "@/utils/searchingUtils";
import SearchAutocomplete from "./SearchBar";
import SearcherOpenerFab from "./SearcheOpenerFab";
import FilterLister from "./FilterLister";

interface BookCatalogProps {}

const shownBooksBySize: Record<Breakpoint, number> = {
  xs: 12,
  sm: 12,
  md: 24,
  lg: 36,
  xl: 36,
};

const BookCatalog: React.FC<BookCatalogProps> = () => {
  const size = useCurrentBreakpoint() || "xs";
  const router = useRouter();
  const {
    totalBookNum,
    isOpenSearcher,
    setOpenSearcher,
    filters,
    setFilters,
    query,
    setQuery,
  } = useSearchContext();

  const [error, setError] = useState<string | null>(null);
  const [shownBooks, setShownBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10) === 0 ? 1 : parseInt(searchParams.get("page") || "1", 10);

  const getStartAndEndIndexes = (page: number, itemsPerPage: number) => {
    const indexOfFirstBook = page * itemsPerPage - itemsPerPage;
    const newLastBookIndex = page * itemsPerPage;
    return [indexOfFirstBook, newLastBookIndex];
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const newBooks = await getBooksByQuery(
          filters,
          page,
          shownBooksBySize[size]
        );
        console.log(newBooks);
        setShownBooks(newBooks.filter((book) => getRelevancy(book.name, query)));
      } catch (err: any) {
        console.log(err?.message);
        setError(err?.message || "unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [filters, page, router,  size]);

  useEffect(() => {
    router.push("/katalog?page=1"); // reset page number on every query
    setShownBooks(prev => prev.filter((book:Book) => getRelevancy(book.name, query)));
  }, [query])

  // Memoize the shownBooks to avoid unnecessary recalculations
  const memoizedShownBooks = useMemo(() => shownBooks, [shownBooks]);

  // Update page on resize
  useEffect(() => {
    if (size) {
      const newItemsPerPage = shownBooksBySize[size];
      const pageNum = page === 0 ? 1 : page;
      const [indexOfFirstBook] = getStartAndEndIndexes(pageNum, newItemsPerPage);
      const newCurrentPage = Math.ceil(indexOfFirstBook / newItemsPerPage);
      router.push(
        `/katalog?page=${Math.min(
          Math.ceil(typeof totalBookNum === 'number' ? totalBookNum : 0 / newItemsPerPage),
          newCurrentPage + 1 || 1
        )}`
      );
    }
  }, [size, totalBookNum, router, page]);

  if (error) {
    return (
      <div>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  const removeFilter = (key: keyof Filters, value: string | boolean) => {
    setFilters((prevFilters: Filters) => {
      const currentFilter = prevFilters[key];
      console.log(key, value, prevFilters[key]);

      if (Array.isArray(currentFilter)) {
        // Remove the specified value from the array
        const updatedArray = currentFilter.filter(
          (item: string) => item !== value
        );
        console.log(updatedArray);
        return {
          ...prevFilters,
          [key]: updatedArray,
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
      <FilterLister filters={filters} removeFilter={removeFilter} />
      <Box className="flex-row flex-wrap w-full gap-4">
        <SearcherOpenerFab
          css={"z-0 mb-2"}
          onClick={() => setOpenSearcher(!isOpenSearcher)}
        />
        <SearchAutocomplete onInputChange={(e) => setQuery(e)} />
      </Box>

      {memoizedShownBooks.length > 0 ? (
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
            {memoizedShownBooks.map((book:Book, index: any) => (
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
            <h1>{totalBookNum} {(totalBookNum instanceof Promise) .toString()}  ... </h1>
          <PaginationLinker
            totalEntries={totalBookNum instanceof Promise ? 0: totalBookNum }
            itemsPerPage={shownBooksBySize[size]}
            folderName="katalog"
          />
        </Box>
      ) : (
        <Typography variant="h6" sx={{ margin: '2rem' }}>Žádné knihy nenalezeny</Typography>
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