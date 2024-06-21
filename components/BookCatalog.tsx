'use client'
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Book } from '@/types/types';
import BookPreview from './BookPreview';
import DotsShower from './DotsShower';

interface BookCatalogProps {
  shownBooks: Promise<Book[]> | Book[];
}

const BookCatalog: React.FC<BookCatalogProps> = ({ shownBooks }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // let isMounted = true;

    const loadBooks = async () => {
      try {
        const resolvedBooks = shownBooks instanceof Promise ? await shownBooks : shownBooks;

        // Check if component is still mounted before setting state
        // if (isMounted) {
        //   setBooks(resolvedBooks);
        // }
      } catch (error: any) {
        setError(error.message);
      }
    };



    loadBooks();

    // return () => {
    //   isMounted = false; // Clean up to prevent state updates on unmounted component
    // };
  }, [shownBooks, books.length ]);

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
      {books?.length > 0 ? (
        <div>
          {books .map((book, key) => (
            <BookPreview key={key} book={book} />
          ))}
        </div>
      ) : (
        // <Typography variant="h5">Loading...</Typography>
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