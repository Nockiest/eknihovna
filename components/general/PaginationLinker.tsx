"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getURLSegment } from "@/utils/getURLSegment";
import { Box } from "@mui/material";
import PaginationLink from "./PaginationLink";

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

  const getVisiblePageNumbers = () => {
    const startPage = Math.max(1, page - 5);
    const endPage = Math.min(totalPages, page + 5);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const visiblePageNumbers = getVisiblePageNumbers();
  if (totalPages <= 1) {
    return null; // If there's only one page or no pages, don't render pagination
  }

  if (totalPages <= 5) {
    return visiblePageNumbers.map((pageNumber) => (
      <Link
        key={pageNumber}
        href={`/${folderName}?page=${pageNumber}`}
        className={`px-3 py-1 rounded ${
          pageNumber === page
            ? "bg-primary-400 text-text-950"
            : "bg-secondary-900 text-text-100"
        }`}
      >
        {pageNumber}
      </Link>
    ));
  }
  return (
    <Box className="flex justify-center gap-2 flex-wrap space-x-2 m-4">
      {page > 6 && (
        <PaginationLink
          pageNumber={1}
          currentPage={page}
          folderName={folderName}
        />
      )}

      {visiblePageNumbers.map((pageNumber) => (
        <PaginationLink
          key={pageNumber}
          pageNumber={pageNumber}
          currentPage={page}
          folderName={folderName}
        />
      ))}

      {page < totalPages - 5 && (
        <PaginationLink
          pageNumber={totalPages}
          currentPage={page}
          folderName={folderName}
        />
      )}
    </Box>
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
