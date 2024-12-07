import BookEditForm from "@/components/BookEditForm";
import { emptyBook } from "@/data/values";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Book } from "@/types/types";
import { postDataToUpload } from "@/features/apiCalls/postDataToUpload";
import updateBookProperty from "@/components/pureCode/updateBookProperty";
import { Box, List, ListItemText, Typography } from "@mui/material";
import React, { useState, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";
import catchError from "@/utils/catchError";
import { useUploadContext } from "@/app/upload/context";
import { previousDay } from "date-fns";
const SingleBookCreator = () => {
  const {books, setBooks} = useUploadContext();
  const [book, setBook] = useState<Book>({ ...emptyBook, id: uuidv4() });
  const [loading, startLoading] = useTransition()
  const submitBook = async () => {
    try {
      console.log(book);
      startLoading( async () => {
          const [error, response] = await catchError(postDataToUpload([book]))
          setBooks( prev => [...prev, book])
          setBook({...emptyBook,id: uuidv4()})

          alert(error? error: response.message);

      })

    } catch (err) {
      console.error("Error updating book:", err);
      alert("Selhal jsem v aktualizování knihy:" + err);
    } finally {
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (!book) {
      const newBook: Book = updateBookProperty(
        name,
        value,
        type,
        checked,
        null
      );
      setBook(newBook);
    } else {
      setBook((prevBook) => {
        if (!prevBook) throw new Error("kniha zatím nebyla vytvořena");
        return updateBookProperty(name, value, type, checked, prevBook);
      });
    }
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      submitBook();
    }
  };
  const createNewBook = () => {
    const newBook: Book = { ...emptyBook, id: uuidv4() };
    setBook(newBook);
  };
  return (
    <Box
      className="mx-auto flex flex-row  gap-2 m-4 overflow-y-auto"
      onKeyUp={(e) => handleKeyPress(e as unknown as KeyboardEvent)}
    >
      <Box>
        <PrimaryButton onClick={createNewBook} disabled={loading}>
          Resetovat hodnoty
        </PrimaryButton>
        <BookEditForm
          book={book}
          handleInputChange={handleInputChange}
          submitBook={submitBook}
        />
      </Box>
      <Box>
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
