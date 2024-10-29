import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridRowModel } from "@mui/x-data-grid";
import { useUploadContext } from "@/app/upload/context";
import { Book } from "@/types/types";
import { postDataToUpload } from "@/features/apiCalls/postDataToUpload";
import UpdatedBooksList from "../../../components/UpdatedBookList";

const BookGrid = () => {
  const { books, setBooks } = useUploadContext(); // Get books from the context
  const [updatedBooks, setUpdatedBooks] = useState<Book[]>([]);
  const [filterText, setFilterText] = useState("");

  const handleCellClick = (params: GridCellParams) => {
    const cellData = params.value;
    navigator.clipboard
      .writeText(cellData as string)
      .then((err) => console.error("Could not copy text: ", err));
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 200, editable: false },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "author", headerName: "Autor", width: 200, editable: true },
    { field: "category", headerName: "Kategorie", width: 150, editable: true },
    { field: "isbn", headerName: "ISBN", width: 150, editable: true },
    { field: "available", headerName: "Dostupná", width: 150, editable: true },
    {
      field: "formaturita",
      headerName: "Maturitní",
      width: 150,
      editable: true,
    },
  ];

  const filteredRows = books.filter((book) =>
    book.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const { id, ...updatedFields } = newRow;

    // Ensure the newRow contains all properties of the Book type
    const updatedBook: Book = { ...oldRow, ...updatedFields } as Book;

    // Update the main books state
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );

    // Update the updatedBooks state
    setUpdatedBooks((prevUpdatedBooks) => {
      const existingIndex = prevUpdatedBooks.findIndex(
        (book) => book.id === updatedBook.id
      );

      if (existingIndex > -1) {
        // If the book already exists in updatedBooks, replace it
        const updatedList = [...prevUpdatedBooks];
        updatedList[existingIndex] = updatedBook;
        return updatedList;
      } else {
        // If not, add the updated book to updatedBooks
        return [...prevUpdatedBooks, updatedBook];
      }
    });

    return updatedBook; // Return the updated row to reflect changes in the grid
  };

  return (
    <Box className="mx-auto overflow-y-auto">
      <Typography variant="h4" gutterBottom>
        Prohlížeč knih
      </Typography>
      <TextField
        label="Filtrovat podle jména"
        variant="outlined"
        fullWidth
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box mt={2} sx={{ height: 400 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          //   autoPageSize
          onCellClick={handleCellClick}
          processRowUpdate={processRowUpdate}
          editMode="cell"
          ignoreDiacritics
        />
      </Box>
      <UpdatedBooksList updatedBooks={updatedBooks} />
      {/* {updatedBooks.map((updated) => (
        <p key={updated.id}>
          {updated.name} {updated.author}
        </p>
      ))} */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          postDataToUpload(updatedBooks);
        }}
        sx={{ mt: 2 }}
        disabled={updatedBooks.length === 0} // Disable if no books are updated
      >
        Potvrdit změny
      </Button>
    </Box>
  );
};

export default BookGrid;
//
