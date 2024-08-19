"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getURLSegment } from "@/utils/getURLSegment";
import PaginationLink from "./PaginationLink";
import useCurrentBreakpoint from "@/utils/useCustomBreakpoint";

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
  const page = parseInt(searchParams.get("page") || "0", 10) ===0? 1: parseInt(searchParams.get("page") || "0", 10);
  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(totalEntries / itemsPerPage)
  );
  useEffect(() => {
    setTotalPages(Math.ceil(totalEntries / itemsPerPage));
  }, [totalEntries, itemsPerPage]);
  const breakPoint = useCurrentBreakpoint()
    let offset = 5
    if (breakPoint === 'xs' || breakPoint === 'sm') {
      offset = 2;

    }
  const getVisiblePageNumbers = () => {

    const startPage = Math.max(1, page - offset);
    const endPage = Math.min(totalPages, page + offset);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const visiblePageNumbers = getVisiblePageNumbers();
  if (totalPages <= 1) {
    return  null  // If there's only one page or no pages, don't render pagination
  }

  if (totalPages <=5) {
    return visiblePageNumbers.map((pageNumber) => (
      <PaginationLink pageNumber={pageNumber} page={page} folderName={folderName} />
      // <Link
      //   key={pageNumber}
      //   href={`/${folderName}?page=${pageNumber}`}
      //   className={`px-3 py-1 rounded ${
      //     pageNumber === page
      //       ?
      //         "bg-primary-400 text-text-950":
      //       "bg-secondary-900 text-text-100"
      //   }`}
      // >
      //   {pageNumber}
      // </Link>
    ));
  }
  return (
    <div className="flex flex-wrap justify-center space-x-2 m-4">
      {page > offset && (
          <PaginationLink pageNumber={1} page={page} folderName={folderName}  className="px-3 py-1 rounded bg-gray-200 text-text-100" />
        // <Link
        //   href={`/${folderName}?page=${1}`}
        //   className="px-3 py-1 rounded bg-gray-200 text-text-100"
        // >
        //   ...1
        // </Link>
      )}

      {visiblePageNumbers.map((pageNumber) => (
         <PaginationLink pageNumber={pageNumber} page={page} folderName={folderName} />
        // <Link
        //   key={pageNumber}
        //   href={`/${folderName}?page=${pageNumber}`}
        //   className={`px-3 py-1 rounded ${
        //     pageNumber === page
        //       ?
        //         "bg-primary-400 text-text-950":
        //       "bg-secondary-900 text-text-100"
        //   }`}
        // >
        //   {pageNumber}
        // </Link>
      ))}

      {page < totalPages - offset && (
         <PaginationLink pageNumber={totalPages} page={page} folderName={folderName}  className="px-3 py-1 rounded bg-gray-200 text-text-100" />
        // <Link
        //   href={`/${folderName}?page=${totalPages}`}
        //   className="px-3 py-1 rounded bg-gray-200 text-text-100"
        // >
        //   ...{totalPages}
        // </Link>
      )}
    </div>
  );
};

export default Pagination;
//   const visiblePageNumbers = getVisiblePageNumbers();

//   const getVisiblePageNumbers = () => {
//     const startPage = Math.max(1, currentPage - 5);
//     const endPage = Math.min(totalPages, currentPage + 5);
//     const pageNumbers = [];
//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
//     return pageNumbers;
//   };

// Sync the state with the URL when the component mounts or when the URL changes
//   useEffect(() => {

//   }, [router]);
