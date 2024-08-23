"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
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
  const breakPoint = useCurrentBreakpoint();
  const [offset, setOffset] = useState<number>(5);
  useEffect(() => {
    if (breakPoint && ["xs", "sm"].indexOf(breakPoint) >= 0) {
      setOffset(2);
    } else {
      setOffset(5);
    }
  }, [breakPoint]);

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
          {page - 1 > offset && (
            <PaginationLink
              pageNumber={1}
              currentPage={page}
              folderName={folderName}
              className="px-3 py-1 rounded bg-gray-200 text-text-100"
            />
          )}

          {/* Render visible page numbers */}
          {visiblePageNumbers.map((pageNumber, key) => (
            <PaginationLink
              pageNumber={pageNumber}
              currentPage={page}
              folderName={folderName}
              key={key}
            />
          ))}

          {/* Show '...' after the last page link if necessary */}
          {page < totalPages - offset && (
            <PaginationLink
              pageNumber={totalPages}
              currentPage={page}
              folderName={folderName}
              className="px-3 py-1 rounded bg-gray-200 text-text-100"
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Pagination;
