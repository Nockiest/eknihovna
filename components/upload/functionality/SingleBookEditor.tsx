import React, { useState } from "react";
import { Book, UploadJsonData } from "@/types/types";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { defaultFilters, bookHeaders } from "@/data/values";
import { postDataToEndpoint } from "@/utils/apiConections/postDataToUpload";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import BookEditForm from "@/components/general/BookEditForm";
import { Box, List, ListItemText, Typography } from "@mui/material";
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
  const [bookId, setBookId] = useState<string>("");
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
        if (!prevBook) throw new Error('kniha zatím nebyla vytvořena'); // Early return if prevBook is unexpectedly null
        return {
          ...prevBook,
          [name]: newValue,
          id: name === 'id' ? String(newValue) : book.id ? book.id : uuidv4(), // Ensure id is always a string
        };
      });
    }
  };
  // Update the book in the database
  const updateBook = async () => {
    if (!book) return;

    setLoading(true);
    setError("");
    const mapObjectToArray = (obj: Record<string, any>, keys: string[]) => {
      return keys.map((key) => obj[key]);
    };

    const row = mapObjectToArray(book, bookHeaders);
    try {
      const newEntry: UploadJsonData = {
        headers:bookHeaders,
        rows: [[...row]],
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
    <Box className="flex-grow-2 overflow-y-auto">
      <h2>Upravit/Přidat jednu knihu</h2>

      <PrimaryButton onClick={createNewBook} disabled={loading}>
        Vytvořit Novou Knihu
      </PrimaryButton>
      <br />
      <input
        type="text"
        placeholder="Vepsat ID"
        value={bookId}
        onChange={(e) => setBookId(e.target.value)}
      />
      {bookId && (
        <PrimaryButton onClick={fetchBook} disabled={loading}>
          Stáhnout knihu podle ID
        </PrimaryButton>
      )}

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

      <Box>
        <Typography variant="h6" > Návod vytvoření nové knihy </Typography>
        <List>
        <ListItemText primary="kliněte na vytvořit knihu" />
        <ListItemText primary="vyplňte políčka podle údajů vaší knihy" />
        <ListItemText primary="klikněte na nahrát knihu" />
        </List>
      </Box>

      <Box>

        <Typography variant="h6" >     Návod upravení existující knihy </Typography>
        <List>
        <ListItemText primary="stáhněte si tabulku z databáze" />
        <ListItemText primary="vyberte v ní id řádku který chcete nahrát" />
        <ListItemText primary="zkopírujte ho do pole vepsat id" />
        <ListItemText primary="upravte políčka podle potřeby" />
        <ListItemText primary="klikněte na nahrát knihu" />
        </List>
      </Box>
    </Box>
  );
};

export default SingleBookEditor;
