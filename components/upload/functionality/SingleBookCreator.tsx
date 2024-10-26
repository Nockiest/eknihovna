import BookEditForm from "@/components/general/BookEditForm";
import { emptyBook } from "@/data/values";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Book } from "@/types/types";
import { postDataToUpload } from "@/utils/apiConections/postDataToUpload";
import updateBookProperty from "@/utils/updateBookProperty";
import { Box, List, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
const SingleBookCreator = () => {
  const [book, setBook] = useState<Book>({ ...emptyBook, id: uuidv4() }  );
  const [loading, setLoading] = useState<boolean>(false);
  const submitBook = async () => {
    try {
      console.log(book);
      const response = await postDataToUpload([book]);
      alert("Kniha úspěšně vytvořena,"+response.message );
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Selhal jsem v aktualizování knihy:" + err);
    } finally {
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (!book) {
      const newBook: Book = updateBookProperty(name, value, type, checked, null);
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
    <Box className="mx-auto flex flex-row  gap-2 m-4 overflow-y-auto" onKeyUp={(e) => handleKeyPress(e as unknown as KeyboardEvent)  }>

      <Box>
      <PrimaryButton onClick={createNewBook} disabled={loading}>
        Resetovat hodnoty
      </PrimaryButton>
        <BookEditForm
          book={book}
          handleInputChange={handleInputChange}
          submitBook={submitBook}
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
