import React, { useState } from "react";
import axios from "axios";
import { Book, UploadJsonData } from "@/types/types";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { defaultFilters } from "@/data/values";
import { postDataToEndpoint } from "@/utils/apiConections/postDataToUpload";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import BookEditForm from "@/components/general/BookEditForm";
import { Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const newBook: Book = {
  id: uuidv4(),
  book_code: -1,
  name: "",
  author: "",
  category: "",
  genres: [],
  umisteni: "",
  signatura: "",
  zpusob_ziskani: "",
  formaturita: false,
  available: false,
  rating: -1,
};
const SingleBookEditor = ({
  setResponseMessage,
}: {
  setResponseMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch book details based on the entered ID
  const fetchBook = async () => {
    if (!bookId) {
      setError("Please enter a valid book ID");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetchFilteredBooks(
        defaultFilters, // defaultFilters or appropriate filter object
        1,
        bookId.trim(),
        10000000
      );

      if (response.length > 0) {
        setBook(response[0]);
      } else {
        setError("Book not found");
      }
    } catch (err) {
      console.error("Error fetching book:", err);
      setError("Book not found or an error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle the book data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: string | string[] | boolean | number = value;

    // Adjust value based on input type
    if (type === "checkbox") {
      newValue = checked;
    } else if (name === "genres") {
      newValue = value.split(",").map((v) => v.trim());
    } else if (type === "number") {
      newValue = value ? parseInt(value, 10) : -1; // Handling numeric input, default to -1 if empty
    }

    if (!book) {
      // If book is null, initialize a new book object
      setBook(newBook);
    } else {
      // Update existing book object
      setBook((prevBook) => {
        if (!prevBook) return null; // Early return if prevBook is unexpectedly null
        return {
          ...prevBook,
          [name]: newValue,
          id: prevBook.id || uuidv4(), // Ensure id is always set
        };
      });
    }
  };
  // Update the book in the database
  const updateBook = async () => {
    if (!book) return;

    setLoading(true);
    setError("");
    try {
      const newEntry: UploadJsonData = {
        headers: [
          "id",
          "book_code",
          "name",
          "author",
          "category",
          "genres",
          "umisteni",
          "signatura",
          "zpusob_ziskani",
          "formaturita",
          "available",
          "rating",
        ],
        rows: [book],
      };
      await postDataToEndpoint(newEntry);
      setResponseMessage("Book updated successfully!");
    } catch (err) {
      console.error("Error updating book:", err);
      setError("Failed to update the book");
    } finally {
      setLoading(false);
    }
  };

  // Initialize a new book with a new UUID and empty values
  const createNewBook = () => {
    setBook(newBook);
    setBookId(""); // Clear the book ID input field
  };

  return (
    <Box className="flex-grow-2">
      <h2>Upravit/Přidat jednu knihu</h2>
      <input
        type="text"
        placeholder="Vepsat ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      <PrimaryButton onClick={fetchBook} disabled={loading}>
        Stáhnout knihu podle ID
      </PrimaryButton>
      <PrimaryButton onClick={createNewBook} disabled={loading}>
        Vytvořit Novou Knihu
      </PrimaryButton>

      {loading && <p>Načítání...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {book && (
        <div>
          <h3>{bookId ? "Upravit Knihu" : "Vytvořit Novou Knihu"}</h3>
          <BookEditForm
            book={book}
            handleInputChange={handleInputChange}
            updateBook={updateBook}
          />
        </div>
      )}
    </Box>
  );
};

export default SingleBookEditor;
