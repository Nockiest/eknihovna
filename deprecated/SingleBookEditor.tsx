"use client";
import React, { useReducer, useState } from "react";
import { Book } from "@/types/types";
import   fetchFilteredBooks   from "@/features/apiCalls/fetchFilteredBooks";
import { postDataToUpload } from "@/features/apiCalls/postDataToUpload";
import BookEditForm from "@/components/BookEditForm";
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
import updateBookProperty from "@/components/pureCode/updateBookProperty";
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

  // fetchess books, the admin could edit
  const handleSearch = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetchFilteredBooks({ name: searchTerm });
      setMatchingBooks(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // selects the book from matching books that wiill be edited
  const handleBookSelection = (selectedBookId: string) => {
    const selectedBook: Book | undefined = matchingBooks.find(
      (book) => book.id === selectedBookId
    );
    if (!selectedBook) {
      console.error("Book not found");
      return;
    }
    dispatch({ type: "SET_EDIT_BOOK", payload: selectedBook });
    console.log(selectedBook);
    setEditedBook(selectedBook);
  };

  // updates the edited book
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (!editedBook) {
      const newBook: Book = updateBookProperty(
        name,
        value,
        type,
        checked,
        null
      );
      setEditedBook(newBook);
    } else {
      setEditedBook((prevBook) => {
        if (!prevBook) throw new Error("kniha zatím nebyla vytvořena");
        return updateBookProperty(name, value, type, checked, prevBook);
      });
    }
  };
  // Update the book in the database
  const submitBook = async () => {
    if (!editedBook) return;

    try {
      console.log(editedBook);
      const res = await postDataToUpload([editedBook]);
      debugger;
      console.log(res);

      alert("Kniha úspěšně aktualizována" + res.data.message);
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Selhal jsem v aktualizování knihy:" + err);
    }
  };
  return (
    <Box className="flex flex-row mx-auto align-center gap-4">
      <Box className="flex flex-col gap-4 mx-auto">
        <TextField
          label="Vyhledat Podle Názvu"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <PrimaryButton
          onClick={handleSearch}
          disabled={searchTerm.length === 0}
        >
          {" "}
          <SearchIcon /> Vyhledat Knihu
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
            // Ensure you are not using ref inappropriately here
            // If needed, you can use the ref like this:
            // ref={yourRef}
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
        <Typography variant="h6"> Návod na upravení knihy </Typography>
        <List>
          <ListItemText primary="zadejte název knihy nebo její část" />
          <ListItemText primary="počkejte, až se zobrazí další výběrové pole" />
          <ListItemText primary="z nabídky vyberte knihu, kterou jste měli na mysli" />
          <ListItemText primary="ve formuláři upravit knihu zadejte nové údaje" />
          <ListItemText primary="nahrajte knihu, čímž přepíšete údaje knihy v databázi" />
        </List>
      </Box>
    </Box>
  );
};

export default SingleBookEditor;
