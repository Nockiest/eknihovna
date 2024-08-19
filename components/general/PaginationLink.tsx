import React from 'react';
import Link from 'next/link';

interface PaginationLinkProps {
  pageNumber: number;
  page: number;
  folderName: string;
}

const PaginationLink: React.FC<PaginationLinkProps> = ({ pageNumber, page, folderName }) => {
  const isActive = pageNumber === page;
  const linkClassName = `px-3 py-1 rounded ${
    isActive ? "bg-primary-400 text-text-950" : "bg-secondary-900 text-text-100"
  }`;

  return (
    <Link href={`/${folderName}?page=${pageNumber}`} className={linkClassName}>
      {pageNumber}
    </Link>
  );
};

export default PaginationLink;
