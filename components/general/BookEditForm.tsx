import { PrimaryButton } from '@/theme/buttons/Buttons';
import { Book } from '@/types/types';
import React from 'react'
import { v4 as uuidv4 } from 'uuid'; // Import the uuid function
type BookEditFormProps = {
    book: Book;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure proper typing of the event
    updateBook: () => void;
  };
const BookEditForm =({ book, handleInputChange, updateBook }: BookEditFormProps) => {

  const generateNewUUID = () => {
    const newUUID = uuidv4();

    // Create a synthetic event to update the UUID using handleInputChange
    const event = {
      target: {
        name: 'id',
        value: newUUID,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(event); // Use handleInputChange to set the new UUID
  };
  return (
    <form>
      <div>
       <label>UUID:</label>
        <input
          type="text"
          name="id"
          value={book.id}
          readOnly // Make the field read-only
        />
        <PrimaryButton type="button" onClick={generateNewUUID}  >
          Generate New UUID
        </PrimaryButton>
      </div>
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
     Nahrát knihu
    </PrimaryButton>
  </form>
  )
}

export default BookEditForm