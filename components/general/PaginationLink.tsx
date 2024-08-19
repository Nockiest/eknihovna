import React from 'react';
import Link from 'next/link';

interface PaginationLinkProps {
  pageNumber: number;
  page: number;
  folderName: string;
  className?: string; // Optional prop for custom className
}

const PaginationLink: React.FC<PaginationLinkProps> = ({ pageNumber, page, folderName, className = '' }) => {
  const isActive = pageNumber === page;
  const baseClassName = `px-3 py-1 rounded ${
    isActive ? "bg-primary-400 text-text-950" : "bg-secondary-900 text-text-100"
  }`;

  const linkClassName = `${baseClassName} ${className}`.trim(); // Combine base and custom className

  return (
    <Link href={`/${folderName}?page=${pageNumber}`} className={linkClassName}>
      {pageNumber}
    </Link>
  );
};

export default PaginationLink;
