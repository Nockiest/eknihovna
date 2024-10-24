import BookEditForm from "@/components/general/BookEditForm";
import { emptyBook } from "@/data/values";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Book } from "@/types/types";
import { postDataToUpload } from "@/utils/apiConections/postDataToUpload";
import { Box, List, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const SingleBookCreator = () => {
  const [book, setBook] = useState<Book>({ ...emptyBook, id: uuidv4() }  );
  const [loading, setLoading] = useState<boolean>(false);
  const uploadBook = async () => {
    try {
      console.log(book);
      await postDataToUpload([book]);
      alert("Kniha úspěšně aktualizována");
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Selhal jsem v aktualizování knihy:" + err);
    } finally {
    }
  };
  // this is dupliacted fix it immidiately!!!!!!
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
      const newBook: Book = { ...emptyBook, id: uuidv4() };
      setBook(newBook);
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
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      uploadBook();
    }
  };
  const createNewBook = () => {
    const newBook: Book = { ...emptyBook, id: uuidv4() };
    setBook(newBook);
  };
  return (
    <Box className="mx-auto flex flex-row  gap-2 m-4 overflow-y-auto" onKeyUp={(e) => handleKeyPress(e as unknown as KeyboardEvent)  }>

      <Box>
      <PrimaryButton onClick={createNewBook} disabled={loading}>
        Resetovat hodnoty
      </PrimaryButton>
        <BookEditForm
          book={book}
          handleInputChange={handleInputChange}
          updateBook={uploadBook}
        />
        <Typography variant="h6"> Návod vytvoření nové knihy </Typography>
        <List>
          <ListItemText primary="kliněte na vytvořit knihu" />
          <ListItemText primary="vyplňte políčka podle údajů vaší knihy" />
          <ListItemText primary="klikněte na nahrát knihu" />
          <ListItemText primary="kniha by měla být přidána do databáze" />
        </List>
      </Box>
    </Box>
  );
};

export default SingleBookCreator;
