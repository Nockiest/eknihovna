import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridCellEditStopParams,
} from "@mui/x-data-grid";
import { useUploadContext } from "@/app/upload/context";
import { Book } from "@/types/types";

const BookGrid = () => {
  const { books, setBooks } = useUploadContext(); // Get books from the context
  const [updatedBooks, setUpdatedBooks] = useState<Book[]>([]);
  const [filterText, setFilterText] = useState("");

  // Function to handle copying cell data to the clipboard
  const handleCellClick = (params: GridCellParams) => {
    const cellData = params.value; // Get the clicked cell's value
    navigator.clipboard.writeText(cellData as string).then(
    //   () => alert(`Copied "${cellData}" to clipboard!`),
      (err) => console.error("Could not copy text: ", err)
    );
  };

  // Define columns for the DataGrid
  const columns: { field: keyof Book; headerName: any; width: number, editable:boolean }[] = [
    { field: "id", headerName: "ID", width: 200, editable: false }, // ID usually shouldn't be editable
    { field: "name", headerName: "Name", width: 200, editable: true },
    { field: "author", headerName: "Autor", width: 200, editable: true },
    { field: "category", headerName: "Kategorie", width: 150, editable: true },
    { field: "isbn", headerName: "ISBN", width: 150, editable: true },
    { field: "available", headerName: "Dostupná", width: 150, editable: true },
    { field: "formaturita", headerName: "Maturitní", width: 150, editable: true },
  ];

  // Filter books based on the search term
  const filteredRows = books.filter((book) =>
    book.name.toLowerCase().includes(filterText.toLowerCase())
  );
  const handleEditCellChange = (params: GridCellEditStopParams) => {
    // Update the books state with the new value
    console.log(params.id)
    const newBooks = books.map((book) =>
      book.id === params.id ? { ...book, [params.field]: params.value } : book
    );

    setBooks(newBooks); // Update the main books state

    // Update the updatedBooks state
    setUpdatedBooks((prev) => {
      const bookToUpdate = newBooks.find((book) => book.id === params.id); // Get the updated book

      if (!bookToUpdate) {
        // If the bookToUpdate is not found, we just return the previous state
        return prev;
      }
      debugger
      // Check if the book already exists in updatedBooks
      const existingBookIndex = prev.findIndex(
        (book) => book.id === bookToUpdate.id
      );

      if (existingBookIndex > -1) {
        // If it exists, replace the existing book
        const updatedList = [...prev];
        updatedList[existingBookIndex] = {...bookToUpdate, [params.field]:params.value}; // Update the specific book
        return updatedList; // Return the updated list
      } else {
        // If it doesn't exist, add the new book
        return [...prev, bookToUpdate]; // Add the new updated book
      }
    });
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
        //   onCellClick={handleCellClick} // Only copy clicked cell's value
          onCellEditStop={handleEditCellChange}
          editMode={'cell'}
          ignoreDiacritics

        />
      </Box>
      {updatedBooks.map((updated) => {
        return <p>{updated.name} {updated.author}</p>
      })}
    </Box>
  );
};
//
//
export default BookGrid;

{
  /* <Button
variant="contained"
color="primary"
startIcon={<AddIcon />}
// onClick={handleAddBook}
>
Add Book
</Button> */
}
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
