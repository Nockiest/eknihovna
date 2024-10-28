

import { testBook } from "@/data/values";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
// import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import { fetchFilteredBooks } from "@/utils/apiConections/fetchFilteredBooks";
import { Book } from "@/types/types";


const BookGrid =   () => {
  const [books, setBooks] = useState<Book[]>([
    // { id: "1", name: "Sample Book", author: "Author A", category: "Fiction", isbn: "1234567890" }
  ]);
  useEffect(() => {
    const fetching = async () => {
        const b:Book[] = await fetchFilteredBooks()
        setBooks(b)
    }
fetching()
  },[])
// const books = await fetchFilteredBooks()
  const [filterText, setFilterText] = useState("");

  const handleAddBook = () => {
    const newBook: Book = {
      id: Date.now().toString(),
      name: "",
      author: "",
      category: "",
      isbn: "",
      available: true,
    };
    setBooks((prev) => [...prev, newBook]);
  };

  const handleDeleteBook = (id: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  const handleEditCellChange = (params: any) => {
    const updatedBooks = books.map((book) =>
      book.id === params.id ? { ...book, [params.field]: params.value } : book
    );
    setBooks(updatedBooks);
  };
  const handleCellClick = (params: any) => {
    const cellData = params.value;
    navigator.clipboard.writeText(cellData).then(
      () => alert(`Copied "${cellData}" to clipboard!`),
      (err) => console.error("Could not copy text: ", err)
    );
  };

  const columns  = [
    {
        field: "id",
        headerName: "ID",
        width: 200,
        // editable: true,
      },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    //   editable: true,
    },
    {
      field: "author",
      headerName: "Author",
      width: 200,
    //   editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    //   editable: true,
    },
    {
      field: "isbn",
      headerName: "ISBN",
      width: 150,
    //   editable: true,
    },
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
  ];

  const filteredRows = books.filter((book) =>
    book.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Box className='mx-auto'>
      <Typography variant="h4" gutterBottom>
        Book Management
      </Typography>
      <TextField
        label="Filter by Name"
        variant="outlined"
        fullWidth
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddBook}
      >
        Add Book
      </Button>
      <Box mt={2} sx={{ height: 400 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
        //   onRowClick={handleCellClick} // Copy to clipboard on row click
        onCellClick={handleCellClick} // Only copy clicked cell's value
        //   pageSize={5}
        //   rowsPerPageOptions={[5]}
        //   disableSelectionOnClick
        //   onCellEditCommit={handleEditCellChange}
        />
      </Box>
    </Box>
  );
};

export default BookGrid;
