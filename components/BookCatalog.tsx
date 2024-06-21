"use client";
// import React, { useState, useEffect } from "react";
// import { Typography } from "@mui/material";
// import { Book } from "@/types/types";
// import BookPreview from "./BookPreview";
// import DotsShower from "./DotsShower";

// interface BookCatalogProps {
//   shownBooks: Promise<Book[]> | Book[];
// }

// const BookCatalog: React.FC<BookCatalogProps> = ({ shownBooks }) => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   useEffect(() => {
//     const loadBooks = async () => {
//       try {
//         const resolvedBooks =
//           shownBooks instanceof Promise ? await shownBooks : shownBooks;
//         setBooks(resolvedBooks);
//       } catch (error: any) {
//         setError(error.message);
//       }
//     };
//     loadBooks();
//   }, [shownBooks, books.length]);

//   if (error) {
//     return (
//       <div>
//         <Typography variant="body1" color="error">
//           {error}
//         </Typography>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {books?.length > 0 ? (
//         <div>
//           {books.map((book, key) => (
//             <BookPreview key={key} book={book} />
//           ))}
//         </div>
//       ) : (
//         <DotsShower />
//       )}
//     </div>
//   );
// };

// export default BookCatalog;
import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Book } from "@/types/types";
import BookPreview from "./BookPreview";
import DotsShower from "./DotsShower";
import { usePathname, useRouter } from "next/navigation";
import PaginationLinker from "./PaginationLinker";
import { getLastURLSegment } from "@/utils/getLastUrlSegment";

interface BookCatalogProps {
  promisedBooks: Promise<Book[]> | Book[]; // Assuming books are passed as a Promise
}
const BookCatalog: React.FC<BookCatalogProps> = ({ promisedBooks }) => {
  const router = useRouter();
  const itemsPerPage = 50;
  const [allbooks, setAllbooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentPage = parseInt(getLastURLSegment(usePathname()), 10);

  const [currentBooks, setCurrentBooks] = useState<Book[]>([]);
  const totalPages = Math.ceil(allbooks?.length / itemsPerPage);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const resolvedBooks = await promisedBooks;
        setAllbooks(resolvedBooks);
      } catch (err) {
        throw new Error("error fetching" + err);
        // setError(err?.message || "Failed to fetch books");
      }
    };

    fetchBooks();
  }, [promisedBooks]);

  useEffect(() => {
    const indexOfLastBook = currentPage * itemsPerPage;
    const indexOfFirstBook = indexOfLastBook - itemsPerPage;
    const currentBooksSlice = allbooks?.slice(indexOfFirstBook, indexOfLastBook);
    setCurrentBooks(currentBooksSlice);
  }, [currentPage, allbooks]);

  if (error) {
    return (
      <div>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </div>
    );
  }


  return (
    <div>
      {currentBooks && currentBooks.length > 0 ? (
        <div>
          {currentBooks.map((book, index) => (
            <BookPreview key={index} book={book} />
          ))}
          <PaginationLinker totalPages={totalPages} folderName="katalog" />
        </div>
      ) : (
        <DotsShower />
      )}
    </div>
  );
};

export default BookCatalog;

// interface BookCatalogProps {
//   // shownBooks: Promise<Book[]> | Book[];
// }

// const BookCatalog: React.FC<BookCatalogProps> = ( ) => {

//   const books =    getBooksByQuery();

//   if (books?.length === 0) {
//     console.log('problem recieving books')
//     return <div>Máme problém získat knihy</ div>
//   }

//   return (

//     <div>
//       {books?.length > 0 && (
//         <table
//           style={{
//             width: '100%',
//             zIndex: -1,
//             backgroundColor: '#f7f6f2',
//             padding: '0.25em',
//             maxHeight: '500px',
//           }}
//         >
//           <tbody>
//         <div>
//            {books.map((book, key) => (
//               <BookPreview key={key} book={book} />
//             ))}
//         </div>

//           </tbody>
//          </table>
//       )}
//     </div>
//   );
// };

// export default BookCatalog;

//   // const [books, setBooks] = useState<Book[]>([]);
//   // const [loading, setLoading] = useState<boolean>(true);
//   // const [error, setError] = useState<string | null>(null);

//   // useEffect(() => {
//   //   const loadBooks = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const resolvedBooks = shownBooks instanceof Promise ? await shownBooks : shownBooks;
//   //       // const strigifiedBooks = JSON.stringify(resolvedBooks, null, 2)

//   //       setBooks(resolvedBooks);

//   //     } catch (error: any) {
//   //       setError(error.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   loadBooks();
//   // }, [shownBooks]);

//   // if (loading) {
//   //   return <Typography variant="h5">Loading...</Typography>;
//   // }

//   // if (error) {
//   //   return (
//   //     <div>
//   //       <Typography variant="body1" color="error">
//   //         {error}
//   //       </Typography>
//   //     </div>
//   //   );
//   // }
