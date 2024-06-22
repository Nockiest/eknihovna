import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getLastURLSegment } from "@/utils/getLastUrlSegment";

interface PaginationProps {
  totalPages: number;
  folderName:string
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, folderName  }) => {
  const currentPage = parseInt(getLastURLSegment( usePathname()), 10);

  const getVisiblePageNumbers = () => {
    const startPage = Math.max(1, currentPage - 5);
    const endPage = Math.min(totalPages, currentPage + 5);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div className="flex justify-center space-x-2 mt-4">
         {currentPage > 6 && (
        <Link href={`/${folderName}/1`} className="px-3 py-1 rounded bg-gray-200 text-text-100">
        ...1
        </Link>
      )}

      {visiblePageNumbers.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={`/${folderName}/${pageNumber}`}
          className={`px-3 py-1 rounded ${
            pageNumber === currentPage
              ? "bg-secondary-500 text-text-100"
              : "bg-primary-500 text-text-100"
          }`}
        >
          {pageNumber}
        </Link>
      ))}

      {currentPage < totalPages - 5 && (
        <Link href={`/${folderName}/${totalPages}`} className="px-3 py-1 rounded bg-gray-200 text-text-100">
          ...{totalPages}
        </Link>
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