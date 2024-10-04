import React, { useState } from "react";
import { Book   } from "@/types/types";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { defaultFilters, bookHeaders, emptyBook } from "@/data/values";
import { postDataToEndpoint } from "@/utils/apiConections/postDataToUpload";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import BookEditForm from "@/components/general/BookEditForm";
import { Box, List, ListItemText, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";


const SingleBookEditor = ( ) => {
  const [bookId, setBookId] = useState<string>("");
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch book details based on the entered ID
  const fetchBook = async () => {
    debugger
    if (!bookId) {
      return alert("Prossím zadejte validnéí ID");
    }
    setLoading(true);
    try {
      const response = await fetchFilteredBooks(
        defaultFilters, // defaultFilters or appropriate filter object
        1,
        bookId.trim(),
        10000000
      );

      response.length > 0?  setBook(response[0]): alert("Book not found");

    } catch (err) {
      console.error("Error fetching book:", err);
      alert("Kniha nenalezena nebo nastal error");
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
      setBook(emptyBook);
    } else {
      // Update existing book object
      setBook((prevBook) => {
        if (!prevBook) throw new Error("kniha zatím nebyla vytvořena"); // Early return if prevBook is unexpectedly null
        return {
          ...prevBook,
          [name]: newValue,
          id: name === "id" ? String(newValue) : book.id ? book.id : uuidv4(), // Ensure id is always a string
        };
      });
    }
  };
  // Update the book in the database
  const updateBook = async () => {
    debugger
    if (!book) return;

    setLoading(true);

    try {
      console.log(book)
      await postDataToEndpoint([book]);
      alert("Kniha úspěšně aktualizována");
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Selhal jsem v aktualizování knihy:"+err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize a new book with a new UUID and empty values
  const createNewBook = () => {
    setBook(emptyBook);
    setBookId(""); // Clear the book ID input field
  };

  return (
    <Box className="mx-16 flex flex-row  gap-2 m-4 overflow-y-auto">
      <Box>
        <Typography variant="h4">Upravit/Přidat jednu knihu</Typography>

        <PrimaryButton onClick={createNewBook} disabled={loading}>
          Vytvořit Novou Knihu
        </PrimaryButton>
        <br />
        <input
          type="text"
          className="w-full"
          placeholder="Nebo vepsat ID knihy v databázi"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
        {bookId && (
          <PrimaryButton onClick={fetchBook} disabled={loading}>
            Stáhnout knihu podle ID
          </PrimaryButton>
        )}

        {loading && <p>Načítání...</p>}

        <Box>
          <Typography variant="h6"> Návod vytvoření nové knihy </Typography>
          <List>
            <ListItemText primary="kliněte na vytvořit knihu" />
            <ListItemText primary="vyplňte políčka podle údajů vaší knihy" />
            <ListItemText primary="klikněte na nahrát knihu" />
            <ListItemText primary="kniha by měla být přidána do databáze" />
          </List>
        </Box>

        <Box>
          <Typography variant="h6">
            Návod upravení existující knihy
          </Typography>
          <List>
            <ListItemText primary="stáhněte si tabulku z databáze" />
            <ListItemText primary="vyberte v ní ID řádku který chcete upravit" />
            <ListItemText primary="zkopírujte ho do pole vepsat ID" />
            <ListItemText primary="kliněte na Stáhnout knihu podle ID" />
            <ListItemText primary="upravte políčka podle potřeby" />
            <ListItemText primary="klikněte na nahrát knihu" />
            <ListItemText primary="kniha s tímto ID by měla být úspěšně upravena" />
          </List>
        </Box>
      </Box>

      <Box>
        {book && (
          <Box>
            <Typography variant='h4'>{bookId ? "Upravit Knihu" : "Vytvořit Novou Knihu"}</Typography>
            <BookEditForm
              book={book}
              handleInputChange={handleInputChange}
              updateBook={updateBook}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SingleBookEditor;
