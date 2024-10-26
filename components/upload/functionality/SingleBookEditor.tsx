"use client";
import React, { useReducer, useState } from "react";
import { Book } from "@/types/types";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { postDataToUpload } from "@/utils/apiConections/postDataToUpload";
import BookEditForm from "@/components/general/BookEditForm";
import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { emptyBook } from "@/data/values";
import { v4 as uuidv4 } from "uuid";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (!editedBook) {
      const newBook: Book = updateBookProperty(name, value, type, checked, null);
      setEditedBook(newBook);
    } else {
      setEditedBook((prevBook) => {
        if (!prevBook) throw new Error("kniha zatím nebyla vytvořena");
        return updateBookProperty(name, value, type, checked, prevBook);
      });
    }
  };
  // Update the book in the database
  const updateBook = async () => {
    if (!editedBook) return;

    try {
      console.log(editedBook);
      await postDataToUpload([editedBook]);
      alert("Kniha úspěšně aktualizována");
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Selhal jsem v aktualizování knihy:" + err);
    }
  };
  return (
    <Box className="flex flex-col gap-4 mx-auto">
      <TextField
        label="Vyhledat Podle Názvu"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <PrimaryButton onClick={handleSearch}>Search</PrimaryButton>
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
            updateBook={updateBook}
          />
        </Box>
      )}
    </Box>
  );
};
//   // const fetchBook = async () => {
//   //   if (!book) {
//   //     return alert("Vyberte prosÍm knihu kterou chcete zobrazit");
//   //   }
//   //   setLoading(true);
//   //   try {
//   //     const response = await fetchFilteredBooks(
//   //       { ...defaultFilters, id: book.id.trim() }, // defaultFilters or appropriate filter object
//   //       1,
//   //       10000000
//   //     );

//   //     response.length > 0 ? setBook(response[0]) : alert("Book not found");
//   //   } catch (err) {
//   //     console.error("Error fetching book:", err);
//   //     alert("Kniha nenalezena nebo nastal error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   // const [book, setBook] = useState<Book | null>(null);
//   // const [loading, setLoading] = useState(false);
//   // const [debouncedBookNameQuery, setDebouncedBookNameQuery] =
//   //   useState<string>("");
//   // const bookNameQuery = useDebounce(debouncedBookNameQuery, 300);
//   // // const [bookId, setBookId] = useState<string>("");
//   // const [options, setOptions] = useState<any[]>([]);

//   // // Fetch book details based on the entered ID
//   // const fetchBook = async () => {
//   //   if (!book) {
//   //     return alert("Vyberte prosÍm knihu kterou chcete zobrazit");
//   //   }
//   //   setLoading(true);
//   //   try {
//   //     const response = await fetchFilteredBooks(
//   //       { ...defaultFilters, id: book.id.trim() }, // defaultFilters or appropriate filter object
//   //       1,
//   //       10000000
//   //     );

//   //     response.length > 0 ? setBook(response[0]) : alert("Book not found");
//   //   } catch (err) {
//   //     console.error("Error fetching book:", err);
//   //     alert("Kniha nenalezena nebo nastal error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // // this is dupliacted fix it immidiately!!!!!!
//   // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const { name, value, type, checked } = e.target;
//   //   let newValue: string | string[] | boolean | number = value;

//   //   // Adjust value based on input type
//   //   if (type === "checkbox") {
//   //     newValue = checked;
//   //   } else if (name === "genres") {
//   //     newValue = value.split(",").map((v) => v.trim());
//   //   } else if (type === "number") {
//   //     newValue = value ? parseInt(value, 10) : -1; // Handling numeric input, default to -1 if empty
//   //   }

//   //   if (!book) {
//   //     // If book is null, initialize a new book object
//   //     const newBook: Book = { ...emptyBook, id: uuidv4() };
//   //     setBook(newBook);
//   //   } else {
//   //     // Update existing book object
//   //     setBook((prevBook) => {
//   //       if (!prevBook) throw new Error("kniha zatím nebyla vytvořena"); // Early return if prevBook is unexpectedly null
//   //       return {
//   //         ...prevBook,
//   //         [name]: newValue,
//   //         id: name === "id" ? String(newValue) : book.id ? book.id : uuidv4(), // Ensure id is always a string
//   //       };
//   //     });
//   //   }
//   // };
//   // // Update the book in the database
//   // const updateBook = async () => {
//   //   debugger;
//   //   if (!book) return;

//   //   setLoading(true);

//   //   try {
//   //     console.log(book);
//   //     await postDataToUpload([book]);
//   //     alert("Kniha úspěšně aktualizována");
//   //   } catch (err) {
//   //     console.error("Error updating book:", err);
//   //     alert("Selhal jsem v aktualizování knihy:" + err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // // Initialize a new book with a new UUID and empty values

//   // const handleKeyPress = (event: KeyboardEvent) => {
//   //   if (event.key === "Enter") {
//   //     fetchBook();
//   //   }
//   // };
//   // const fetchBookById = async (id: string) => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await fetchFilteredBooks(
//   //       { ...defaultFilters, id },
//   //       1,
//   //       10000000
//   //     );
//   //     response.length > 0 ? setBook(response[0]) : alert("Book not found");
//   //   } catch (err) {
//   //     console.error("Error fetching book:", err);
//   //     alert("Kniha nenalezena nebo nastal error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   // useEffect(() => {
//   //   const asyncFce = async () => {
//   //     const allPossibleBooks = await fetchFilteredBooks({
//   //       ...defaultFilters,
//   //       name: book?.name || defaultFilters.name,
//   //     });
//   //     const filteredOptions = allPossibleBooks.map(({ name }) => (
//   //       name
//   //      ));
//   //     setOptions(filteredOptions);
//   //   };
//   //   asyncFce();
//   // }, [debouncedBookNameQuery]);

//   // const [currentValue, setCurrentValue] = useState<string | null>(null);

//   // return (
//   //   <Box
//   //     className="mx-16 flex flex-row  gap-2 m-4 overflow-y-auto"
//   //     onKeyUp={(e) => handleKeyPress(e as unknown as KeyboardEvent)}
//   //   >
//   //     <Box>
//   //       <Autocomplete
//   //         disablePortal
//   //         options={options}
//   //         value={currentValue} // Set value to book name (or empty if no book selected)
//   //         getOptionLabel={(option) =>
//   //           option
//   //         }
//   //         renderOption={(props, option) => (
//   //           <li {...props} key={option.id}>
//   //             {option }

//   //           </li>
//   //         )}
//   //         onChange={(_, selectedOption) => {
//   //           if (selectedOption ) {
//   //             // Set the book name to display in the input field
//   //             setBook((prevBook) => {
//   //               const restBook = prevBook ? prevBook : emptyBook;
//   //               return {
//   //                 ...restBook,
//   //                 name: selectedOption
//   //               };
//   //             });
//   //             setCurrentValue(selectedOption );
//   //             setDebouncedBookNameQuery(selectedOption ); // Display selected name
//   //             fetchBookById(selectedOption.id); // Fetch book details by id
//   //           }
//   //         }}
//   //         onInputChange={(event, newWord) => {
//   //           console.log(newWord);
//   //           setCurrentValue(newWord);
//   //           setDebouncedBookNameQuery(newWord ? newWord : ""); // Keep track of user input
//   //         }}
//   //         renderInput={(params) => (
//   //           <TextField {...params} label="Vyhledat knihu" variant="outlined" />
//   //         )}
//   //       />

//   //       {loading && <p>Načítání...</p>}

//   //       <Box>
//   //         <Typography variant="h6">Návod upravení existující knihy</Typography>
//   //         <List>
//   //           <ListItemText primary="stáhněte si tabulku z databáze" />
//   //           <ListItemText primary="vyberte v ní ID řádku který chcete upravit" />
//   //           <ListItemText primary="zkopírujte ho do pole vepsat ID" />
//   //           <ListItemText primary="kliněte na Stáhnout knihu podle ID" />
//   //           <ListItemText primary="upravte políčka podle potřeby" />
//   //           <ListItemText primary="klikněte na nahrát knihu" />
//   //           <ListItemText primary="kniha s tímto ID by měla být úspěšně upravena" />
//   //         </List>
//   //       </Box>
//   //     </Box>

//   //     <Box>
//   //       {book && (
//   //         <Box>
//   //           <Typography variant="h4">
//   //             {debouncedBookNameQuery} Upravit knihu
//   //           </Typography>
//   //           <BookEditForm
//   //             book={book}
//   //             handleInputChange={handleInputChange}
//   //             updateBook={updateBook}
//   //           />
//   //         </Box>
//   //       )}
//   //     </Box>
//   //   </Box>
//   // );
// };

export default SingleBookEditor;
