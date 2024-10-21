import { PrimaryButton } from "@/theme/buttons/Buttons";
import StyledInput from "@/theme/input/Input";
import { Book } from "@/types/types";
import { Box, Checkbox } from "@mui/material";
import { Input } from "postcss";
import React from "react";
import { v4 as uuidv4 } from "uuid"; // Import the uuid function
type BookEditFormProps = {
  book: Book;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Ensure proper typing of the event
  updateBook: () => void;
};
const BookEditForm = ({
  book,
  handleInputChange,
  updateBook,
}: BookEditFormProps) => {
  const generateNewUUID = () => {
    console.log("Generating new  id")
    const newUUID = uuidv4();

    // Create a synthetic event to update the UUID using handleInputChange
    const event = {
      target: {
        name: "id",
        value: newUUID,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(event); // Use handleInputChange to set the new UUID
  };
  return(
      <form className="border-2 border-gray-300 p-4 rounded-lg">
        <Box className="flex items-center mb-4">
          <label className="w-1/4 text-right pr-4">ID:</label>
          <input
            type="text"
            name="id"
            value={book.id}
            readOnly

            className="w-3/4"
          />
        </Box>
        <PrimaryButton type="button" onClick={generateNewUUID} className="mb-4">
          Vygenerovat nové ID
        </PrimaryButton>
        {[
          { label: "Název", name: "name", type: "text", value: book.name },
          { label: "Autor", name: "author", type: "text", value: book.author },
          { label: "Kategorie", name: "category", type: "text", value: book.category },
          { label: "Žánry (odělené čárkou)", name: "genres", type: "text", value: book.genres ? book.genres.join(", ") : "" },
          { label: "Signatura", name: "signatura", type: "text", value: book.signatura },
          { label: "Způsob Získání", name: "zpusob_ziskani", type: "text", value: book.zpusob_ziskani },
          { label: "isbn", name: "isbn", type: "text", value: book.isbn },

        ].map((field) => (
          <div key={field.name} className="flex items-center mb-4">
            <label className="w-1/4 text-right pr-4">{field.label}:</label>
            <StyledInput
              type={field.type}
              name={field.name}
              value={field.value || ""}
              onChange={handleInputChange}
              className="w-3/4"
            />
          </div>
        ))}
        <div className="flex items-center mb-4">
          <label className="w-1/4 text-right pr-4">Maturitní:</label>
          <Checkbox
            name="formaturita"
            checked={book.formaturita || false}
            onChange={handleInputChange}
            className="ml-4"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="w-1/4 text-right pr-4">Dostupná:</label>
          <Checkbox
            name="available"
            checked={book.available || false}
            onChange={handleInputChange}
            className="ml-4"
          />
        </div>
        <PrimaryButton type="button" onClick={() => updateBook()} className="mt-4">
          Nahrát knihu
        </PrimaryButton>
      </form>
    )
  };

export default BookEditForm;
