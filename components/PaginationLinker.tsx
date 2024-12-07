"use client";
import React, { useEffect, useState } from "react";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
import PaginationLink from "./PaginationLink";
// import useCurrentBreakpoint from "@/features/hooks/useCustomBreakpoint";

interface PaginationProps {
  totalEntries: number;
  itemsPerPage: number;
  folderName: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalEntries,
  itemsPerPage,
  folderName,
}) => {
  const searchParams = useSearchParams();
  const page =
    parseInt(searchParams.get("page") || "0", 10) === 0
      ? 1
      : parseInt(searchParams.get("page") || "0", 10);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalEntries / itemsPerPage)
  );
  useEffect(() => {
    setTotalPages(Math.ceil(totalEntries / itemsPerPage));
  }, [totalEntries, itemsPerPage]);
  // const breakPoint = useCurrentBreakpoint();
  const offset = 3
  // const [offset, setOffset] = useState<number>(5);
  // useEffect(() => {
  //   if (breakPoint && ["xs", "sm"].indexOf(breakPoint) >= 0) {
  //     setOffset(5);
  //   } else {
  //     setOffset(10);
  //   }
  // }, [breakPoint]);

  const getVisiblePageNumbers = ():number[] => {
    // let pagesFront =  Math.min( page- 1   , offset)
    // let pagesBack = Math.min(totalPages - page , offset)
    const pageNumbers = [];
    let unfoundPages = 0
    // try to get 3 pages in front of the current
    for (let i = page - offset; i <= page + offset; i++) {
       // add found pages to visible
      if (i >= 1 && i <= totalPages) {
        console.log(i)
       pageNumbers.push(i);
      } else {
        unfoundPages += 1
      }
    }
    if (unfoundPages === 0) {
      return pageNumbers;

    } else if (page - offset > 0) {
      for (let i = page - offset; i > 0 && unfoundPages>0; i-- ){
        pageNumbers.push(i);
        unfoundPages--
      }
    } else if (page + offset < totalPages) {
      for (let i = page + offset +1; i < totalPages && unfoundPages>0; i++ ){
        console.log(i)
        pageNumbers.push(i);
        unfoundPages--
      }
    }
    return pageNumbers.sort((a, b) => a - b);;
    // any unfoun number of pages in front will be added to the page looked for in the back
    // look for pages in the back


    // const startPage = Math.max(1, page - offset);
    // const endPage = Math.min(totalPages, page + offset);
    // for (let i = startPage; i <= endPage; i++) {
    //   pageNumbers.push(i);
    // }
  };

  const visiblePageNumbers = getVisiblePageNumbers();
  if (totalPages <= 1) {
    return null; // If there's only one page or no pages, don't render pagination
  }

  return (
    <Box className="flex flex-wrap justify-center space-x-2 m-4">
      {totalPages <= 5 ? (
        // Render pagination links if totalPages is 5 or less
        visiblePageNumbers.map((pageNumber, key) => (
          <PaginationLink
            pageNumber={pageNumber}
            currentPage={page}
            folderName={folderName}
            key={key}
          />
        ))
      ) : (
        <>
          {/* Show '...' before the first page link if necessary */}
          {/* {page - 1 > offset && (
            <PaginationLink
              pageNumber={1}
              currentPage={page}
              folderName={folderName}
              className="px-3 py-1 rounded bg-gray-200 text-text-100"
            />
          )} */}

          {/* Render visible page numbers */}
          {visiblePageNumbers.map((pageNumber, key) => (
            <PaginationLink
              pageNumber={pageNumber}
              currentPage={page}
              folderName={folderName}
              key={key}
            />
          ))}

          {/* Show '...' after the last page link if necessary
          {page < totalPages - offset && (
            <PaginationLink
              pageNumber={totalPages}
              currentPage={page}
              folderName={folderName}
              className="px-3 py-1 rounded bg-gray-200 text-text-100"
            />
          )} */}
        </>
      )}
    </Box>
  );
};

export default Pagination;
