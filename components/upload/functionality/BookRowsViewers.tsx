

import React, { useState,   } from "react";
import {
  Box,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { useUploadContext } from "@/app/upload/context";
import { Book } from "@/types/types";

const BookGrid = () => {
  const { books } = useUploadContext(); // Get books from the context
  const [filterText, setFilterText] = useState("");

  // Function to handle copying cell data to the clipboard
  const handleCellClick = (params: GridCellParams) => {
    const cellData = params.value; // Get the clicked cell's value
    navigator.clipboard.writeText(cellData as string).then(
      () => alert(`Copied "${cellData}" to clipboard!`),
      (err) => console.error("Could not copy text: ", err)
    );
  };

  // Define columns for the DataGrid
  const columns: {field: keyof Book, headerName:any, width:number}[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "author", headerName: "Autor", width: 200 },
    { field: "category", headerName: "kategorie", width: 150 },
    { field: "isbn", headerName: "ISBN", width: 150 },
    { field: "available", headerName: "Dostupná", width: 150 },
    { field: "formaturita", headerName: "Maturitní", width: 150 },
  ];

  // Filter books based on the search term
  const filteredRows = books.filter((book) =>
    book.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Box className='mx-auto'>
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
          onCellClick={handleCellClick} // Only copy clicked cell's value
        //   pageSize={5} // Optional: set a page size
        //   rowsPerPageOptions={[5]} // Optional: allow user to change page size
        //   disableSelectionOnClick // Optional: disable row selection on click
        />
      </Box>
    </Box>
  );
};

export default BookGrid;

{/* <Button
variant="contained"
color="primary"
startIcon={<AddIcon />}
// onClick={handleAddBook}
>
Add Book
</Button> */}
//   const handleAddBook = () => {
//     const newBook: Book = {
//       id: Date.now().toString(),
//       name: "",
//       author: "",
//       category: "",
//       isbn: "",
//       available: true,
//     };
//     setBooks((prev) => [...prev, newBook]);
//   };

//   const handleDeleteBook = (id: string) => {
//     setBooks((prev) => prev.filter((book) => book.id !== id));
//   };

//   const handleEditCellChange = (params: any) => {
//     const updatedBooks = books.map((book) =>
//       book.id === params.id ? { ...book, [params.field]: params.value } : book
//     );
//     setBooks(updatedBooks);
//   };

   // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 100,
    //   renderCell: (params) => (
    //     <IconButton color="error" onClick={() => handleDeleteBook(params.id.toString())}>
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // },