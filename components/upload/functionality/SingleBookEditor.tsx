"use client";
import React, { useReducer, useState } from "react";
import { Book } from "@/types/types";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { postDataToUpload } from "@/utils/apiConections/postDataToUpload";
import BookEditForm from "@/components/general/BookEditForm";
import {
  Box,
  List,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import SearchIcon from "@mui/icons-material/Search";
import updateBookProperty from "@/utils/updateBookProperty";
const initialState = {
  idle: true,
  loading: false,
  findBook: null,
  editBook: null,
};

type State = {
  idle: boolean;
  loading: boolean;
  findBook: Book[] | null;
  editBook: Book | null;
};

type Action =
  | { type: "SET_IDLE"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CHOOSE_FROM_BOOKS"; payload: Book[] | null }
  | { type: "SET_EDIT_BOOK"; payload: Book | null };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IDLE":
      return { ...state, idle: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CHOOSE_FROM_BOOKS":
      return { ...state, findBook: action.payload };
    case "SET_EDIT_BOOK":
      return { ...state, editBook: action.payload };
    default:
      return state;
  }
};



const SingleBookEditor = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchingBooks, setMatchingBooks] = useState<Book[]>([]);
  const [editedBook, setEditedBook] = useState<Book | null>(null);
  const [bookId, setBookId] = useState("");  // New state for book ID input

  // Fetches books by name
  const handleSearch = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetchFilteredBooks({ name: searchTerm });
      setMatchingBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Fetches a book by ID as soon as an ID is entered
  const handleFetchById = async () => {
    if (!bookId) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const book = await fetchFilteredBooks( {...defaultFilters, id:bookId},1,  1);
      setEditedBook(book[0]);
    } catch (error) {
      console.error("Error fetching book by ID:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Selects book from matching books
  const handleBookSelection = (selectedBookId: string) => {
    const selectedBook = matchingBooks.find((book) => book.id === selectedBookId);
    if (!selectedBook) {
      console.error("Book not found");
      return;
    }
    dispatch({ type: "SET_EDIT_BOOK", payload: selectedBook });
    setEditedBook(selectedBook);
  };

  // Updates the edited book properties
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (!editedBook) {
      const newBook: Book = updateBookProperty(name, value, type, checked, null);
      setEditedBook(newBook);
    } else {
      setEditedBook((prevBook) => {
        if (!prevBook) throw new Error("No book to update");
        return updateBookProperty(name, value, type, checked, prevBook);
      });
    }
  };

  // Submits the edited book to the database
  const submitBook = async () => {
    if (!editedBook) return;

    try {
      const res = await postDataToUpload([editedBook]);
      alert("Book successfully updated: " + res.data.message);
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book: " + err);
    }
  };

  return (
    <Box className="flex flex-row mx-auto align-center gap-4">
      <Box className="flex flex-col gap-4 mx-auto">
        <TextField
          label="Vyhledat Podle ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          onBlur={handleFetchById}  // Trigger fetch on blur
        />
        <TextField
          label="Vyhledat Podle Názvu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <PrimaryButton
          onClick={handleSearch}
          disabled={searchTerm.length === 0}
        >
          <SearchIcon /> Vyhledat
        </PrimaryButton>

        {state.loading && <Typography>Načítám...</Typography>}
        {matchingBooks.length > 0 && (
          <Select
            sx={{
              border: "black 2px solid",
            }}
            value={editedBook?.id || ""}
            onChange={(event) => {
              handleBookSelection(event.target.value as string);
            }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Vyberte knihu
            </MenuItem>
            {matchingBooks.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.name}
              </MenuItem>
            ))}
          </Select>
        )}

        {editedBook && (
          <Box>
            <Typography variant="h4">Upravit knihu</Typography>
            <BookEditForm
              book={editedBook}
              handleInputChange={handleInputChange}
              submitBook={submitBook}
            />
          </Box>
        )}
      </Box>
      <Box>
        <Typography variant="h6">Návod na upravení knihy</Typography>
        <List>
          <ListItemText primary="Zadejte ID nebo název knihy" />
          <ListItemText primary="Počkejte na zobrazení výběrového pole" />
          <ListItemText primary="Vyberte knihu, kterou chcete upravit" />
          <ListItemText primary="Upravte údaje v části 'Upravit knihu'" />
          <ListItemText primary="Nahrajte změny do databáze" />
        </List>
      </Box>
    </Box>
  );
};

export default SingleBookEditor;
