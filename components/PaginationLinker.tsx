import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages  }) => {



  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentPage = parseInt(segments[segments.length - 1], 10);

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
        <Link href={`/katalog/1`} className="px-3 py-1 rounded bg-gray-200 text-gray-800">
        ...1
        </Link>
      )}

      {visiblePageNumbers.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={`/katalog/${pageNumber}`}
          className={`px-3 py-1 rounded ${
            pageNumber === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {pageNumber}
        </Link>
      ))}

      {currentPage < totalPages - 5 && (
        <Link href={`/katalog/${totalPages}`} className="px-3 py-1 rounded bg-gray-200 text-gray-800">
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