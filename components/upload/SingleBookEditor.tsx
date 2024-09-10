import React, { useState } from 'react';
import axios from 'axios';
import { Book, UploadJsonData } from '@/types/types';
import { fetchFilteredBooks } from '@/utils/apiConections/fetchFilteredBooks';
import { defaultFilters } from '@/data/values';
import { postDataToEndpoint } from '@/utils/apiConections/postDataToUpload';
import { PrimaryButton } from '@/theme/buttons/Buttons';

const SingleBookEditor = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState<Book|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch book details based on the entered ID
  const fetchBook = async () => {
    if (!bookId) {
      setError('Please enter a valid book ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetchFilteredBooks(defaultFilters, 1, bookId.trim(), 10000000);


      if (response.length > 0) {
        setBook(response[0]);

      } else {
        console.error("Error fetching single book", response)
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Book not found or an error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle the book data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!book) return; // Early return if book is null

    setBook((prevBook) => {
      if (!prevBook) return prevBook; // Type guard to prevent null

      // Ensuring the object returned is of type Book
      return {
        ...prevBook,
        [name]: value,
      } as Book; // Type assertion here ensures the object matches the Book type
    });
  };
  // Update the book in the database
  const updateBook = async () => {
    if (!book) return;

    setLoading(true);
    setError('');
    try {
      // Prepare data to send to the endpoint
      const jsonData: UploadJsonData = {
        headers: [
          'id', 'book_code', 'name', 'author', 'description', 'category', 'genres', 'rating', 'available', 'formaturita', 'bookCoverURL'
        ],
        rows: [ [ // wrap the book object in an array to match the expected structure
          book.id,
          book.book_code,
          book.name,
          book.author,
          book.description, // Make sure 'description' is a field in the book object
          book.category,
          book?.genres?.join(', ')||[], // Assuming genres is an array of strings
          book.rating,
          book.available,
          book.formaturita,
          book.bookCoverURL // Ensure this field exists in the book object
        ]]
      };
      await postDataToEndpoint(jsonData);
      alert('Book updated successfully!');
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Failed to update the book');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Book Editor</h2>
      <input
        type="text"
        placeholder="Enter Book ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <PrimaryButton onClick={fetchBook} disabled={loading}>
        Fetch Book
      </PrimaryButton>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {book && (
        <div>
          <h3>Edit Book</h3>
          <form>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="name"
                value={book.name || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={book.author || ''}
                onChange={handleInputChange}
              />
            </div>
            {/* Add more fields as needed */}
            <PrimaryButton type="button" onClick={updateBook}>
              Update Book
            </PrimaryButton>
          </form>
        </div>
      )}
    </div>
  );
};

export default SingleBookEditor;
