import React from 'react'
import BookPreview from './BookPreview';
import { Book } from '@/types/types';

type CatalogPageProps = {
  shownBooks: Book[]
}

const BookCatalog : React.FC<CatalogPageProps> = ({shownBooks}) => {
  return (
    <div>
         {shownBooks.length > 0 && (
        <table
          style={{
            width: "100%",
            zIndex: -1,
            backgroundColor: "#f7f6f2",
            padding: "0.25em",
            maxHeight: "500px",
          }}
        >
          <tbody>

            {shownBooks.map((shownBook, key) => {
              return <BookPreview key={key}  book={shownBook} />;
            })}
          </tbody>
        </table>
      )}

    </div>
  )
}

export default BookCatalog