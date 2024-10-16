import React, { useState } from "react";
import axios from "axios"; // or any other HTTP client of your choice
import { Button, TextField, Typography, Box, List, ListItemText } from "@mui/material"; // MUI components
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { defaultFilters } from "@/data/values";
interface BookDeletionProps {
  }

  // Define the functional component with the props interface
  const SingleBookDeleter: React.FC<BookDeletionProps> = ( ) => {
    const [bookId, setBookId] = useState<string>("");
    const [bookName, setBookName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch the book details based on ID
    const fetchBook = async (id: string) => {
      if (!id) {
        setError("Zadejte platné ID knihy");
        return;
      }

      setLoading(true);
      setError("");
      try {
        // Assume fetchFilteredBooks is a function that fetches books based on activeFilters
        const response = await fetchFilteredBooks(
          defaultFilters, // defaultFilters or appropriate filter object
          1,
          bookId.trim(),
          10000000
        );

        if (response.length > 0 && response[0].name) {
          setBookName(response[0].name);
        } else {
          setError("Kniha nebyla nalezena");
        }
      } catch (err) {
        console.error("Chyba při získávání knihy:", err);
        setError("Kniha nebyla nalezena nebo došlo k chybě");
      } finally {
        setLoading(false);
      }
    };

    // Handle ID input change
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBookId(e.target.value);
    };

    // Handle fetch book button click
    const handleFetchBook = () => {
      if (bookId) {
        fetchBook(bookId);
      } else {
        setError("ID nemůže být prázdné.");
      }
    };

    // Handle delete book
    const deleteData = async (id: string) => {
      try {
        // Ensure the ID is provided
        if (!id) {
          throw new Error("ID musí být poskytnuto pro smazání.");
        }
        const userConfirmed = window.confirm("Opravdu chcete tuto knihu smazat?");
        if (!userConfirmed) {
          return; // Exit if the user doesn't confirm
        }
        // Send DELETE request with the ID as part of the URL or query parameters
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/upload`,
          {
            data: { id }, // Include the ID in the request body if your API expects it this way
          }
        );

        // Set response message from the server
        alert(response.data.message);
      } catch (error: any) {
        // Log and set response message on error
        console.error("Chyba při mazání dat ze serveru:", error.message);
        alert("Chyba při mazání dat: " + error.message);
      }
    };

    return (
      <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Smazání knihy
        </Typography>

        <TextField
          label="ID knihy"
          value={bookId}
          onChange={handleIdChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchBook}
          disabled={loading}
        >
          Načíst knihu
        </Button>

        {error && <Typography color="error">{error}</Typography>}

        {bookName && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              Kniha k odstranění: {bookName}
            </Typography>
          <br />
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteData(bookId)}
              disabled={loading}
            >
              Smazat knihu
            </Button>
          </Box>
        )}

            <Box>

            <Typography variant="h6" > Návod jak smazat jedinou knihu</Typography>
            <List>
            <ListItemText primary="zadejte do pole id knihy" />
            <ListItemText primary="Zobrazí se vám kniha, která byla nalezena v databázi" />
            <ListItemText primary="pokud kniha s tímto id v db. není, zobrazí se error" />
            <ListItemText primary="kliněte na smazat knihu" />
            <ListItemText primary="pro kontrolu stáhněte data ze serveru a ověřte, že kniha se zadaným ID byla opravdu smazána" />
            </List>
            </Box>
      </Box>
    );
  };
export default SingleBookDeleter;
