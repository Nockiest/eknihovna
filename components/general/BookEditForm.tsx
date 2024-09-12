import { PrimaryButton } from '@/theme/buttons/Buttons';
import { Book } from '@/types/types';
import React from 'react'
type BookEditFormProps = {
    book: Book;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure proper typing of the event
    updateBook: () => void;
  };
const BookEditForm =({ book, handleInputChange, updateBook }: BookEditFormProps) => {
  return (
    <form>
    <div>
      <label>Title:</label>
      <input
        type="text"
        name="name"
        value={book.name || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Author:</label>
      <input
        type="text"
        name="author"
        value={book.author || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Book Code:</label>
      <input
        type="number"
        name="book_code"
        value={book.book_code || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Category:</label>
      <input
        type="text"
        name="category"
        value={book.category || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Genres (comma separated):</label>
      <input
        type="text"
        name="genres"
        value={book.genres ? book.genres.join(", ") : ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Location (Umístění):</label>
      <input
        type="text"
        name="umisteni"
        value={book.umisteni || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Signatura:</label>
      <input
        type="text"
        name="signatura"
        value={book.signatura || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>(Způsob Získání):</label>
      <input
        type="text"
        name="zpusob_ziskani"
        value={book.zpusob_ziskani || ""}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Maturitní:</label>
      <input
        type="checkbox"
        name="formaturita"
        checked={book.formaturita || false}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label>Available:</label>
      <input
        type="checkbox"
        name="available"
        checked={book.available || false}
        onChange={handleInputChange}
      />
    </div>
    {/* <div>
      <label>Rating:</label>
      <input
        type="number"
        name="rating"
        value={book.rating || ""}
        onChange={handleInputChange}
      />
    </div> */}

    <PrimaryButton type="button" onClick={() => updateBook()}>
      Update Book
    </PrimaryButton>
  </form>
  )
}

export default BookEditForm