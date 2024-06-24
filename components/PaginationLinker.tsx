import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation";
import { getURLSegment } from "@/utils/getURLSegment";

interface PaginationProps {
  totalPages: number;
  folderName: string;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, folderName }) => {
  // const currentPage = parseInt(getURLSegment(usePathname(), 1), 10);
  // const { page } = router.query; // Extract the 'page' parameter from the URL query
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page')||'0', 10)
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

  return (
    <div className="flex justify-center space-x-2 m-4">
      {page > 6 && (
        <Link
          href={`/${folderName}?page=${1}`}
          className="px-3 py-1 rounded bg-gray-200 text-text-100"
        >
          ...1
        </Link>
      )}

      {visiblePageNumbers.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={`/${folderName}?page=${pageNumber}`}
          className={`px-3 py-1 rounded ${
            pageNumber === page
              ? "bg-secondary-500 text-text-100"
              : "bg-primary-500 text-text-100"
          }`}
        >
          {pageNumber}
        </Link>
      ))}

      {page < totalPages - 5 && (
        <Link
          href={`/${folderName}?page=${totalPages}`}
          className="px-3 py-1 rounded bg-gray-200 text-text-100"
        >
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
