import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridRowModel,
} from "@mui/x-data-grid";
import { useUploadContext } from "@/app/upload/context";
import { Book } from "@/types/types";

const BookGrid = () => {
  const { books, setBooks } = useUploadContext(); // Get books from the context
  const [updatedBooks, setUpdatedBooks] = useState<Book[]>([]);
  const [filterText, setFilterText] = useState("");

  const handleCellClick = (params: GridCellParams) => {
    const cellData = params.value;
    navigator.clipboard.writeText(cellData as string).then(
      (err) => console.error("Could not copy text: ", err)
    );
  };

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 200, editable: false },
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "author", headerName: "Autor", width: 200, editable: true },
    { field: "category", headerName: "Kategorie", width: 150, editable: true },
    { field: "isbn", headerName: "ISBN", width: 150, editable: true },
    { field: "available", headerName: "Dostupná", width: 150, editable: true },
    { field: "formaturita", headerName: "Maturitní", width: 150, editable: true },
  ];

  const filteredRows = books.filter((book) =>
    book.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const { id, ...updatedFields } = newRow;

    // Update the main books state
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, ...updatedFields } : book
      )
    );

    // Update the updatedBooks state
    setUpdatedBooks((prevUpdatedBooks) => {
      const existingIndex = prevUpdatedBooks.findIndex((book) => book.id === id);

      if (existingIndex > -1) {
        const updatedList = [...prevUpdatedBooks];
        updatedList[existingIndex] = { ...updatedList[existingIndex], ...updatedFields };
        return updatedList;
      } else {
        return [...prevUpdatedBooks, { id, ...updatedFields }];
      }
    });
    return newRow; // Return the updated row to reflect changes in the grid
  };

  return (
    <Box className="mx-auto">
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
          autoPageSize
          onCellClick={handleCellClick}
          processRowUpdate={processRowUpdate}
          editMode="cell"
          ignoreDiacritics
        />
      </Box>
      {updatedBooks.map((updated) => (
        <p key={updated.id}>{updated.name} {updated.author}</p>
      ))}
    </Box>
  );
};

export default BookGrid;
