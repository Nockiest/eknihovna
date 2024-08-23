import Link from "next/link";

interface PaginationLinkProps {
  pageNumber: number;
  currentPage: number;
  folderName: string;
}

const PaginationLink : React.FC<PaginationLinkProps> = ({
  pageNumber,
  currentPage,
  folderName,
}) => {
  return (
    <Link
      key={pageNumber}
      href={`/${folderName}?page=${pageNumber}`}
      className={`px-3 py-1 rounded mt-2 ${
        pageNumber === currentPage
          ? "bg-primary-400 text-text-950"
          : "bg-secondary-900 text-text-100"
      }`}
    >
      {pageNumber}
    </Link>
  );
};

export default PaginationLink ;
