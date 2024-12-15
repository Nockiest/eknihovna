import React, { useState, useTransition } from "react";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridRowModel,
  GridEventListener,
} from "@mui/x-data-grid";
import { useUploadContext } from "@/app/upload/context";
import { Book } from "@/types/types";
import { postDataToUpload } from "@/features/apiCalls/postDataToUpload";
import UpdatedBooksList from "../../../components/UpdatedBookList";
import { DangerButton } from "@/theme/buttons/Buttons";
import { csCZ } from "@mui/x-data-grid/locales";
import catchError from "@/utils/catchError";
const BookGrid = () => {
  const { books, setBooks } = useUploadContext(); // Get books from the context
  const [updatedBooks, setUpdatedBooks] = useState<Book[]>([]);
  const [filterText, setFilterText] = useState("");
  const [originalBooks, setOriginalBooks] = useState(books); // Keep a copy of the original books
  // Clipboard paste handler for editable cells
  const handleCellPaste = async (params: GridCellParams) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (params.isEditable) {
        processRowUpdate(
          { ...params.row, [params.field]: clipboardText },
          params.row
        );
      }
    } catch (err) {
      console.error("Error reading clipboard text:", err);
    }
  };
  const handleCellClick = (params: GridCellParams) => {
    if (params.field === "id") {
      navigator.clipboard
        .writeText(params.value as string)
        .then(() => {
          alert(`zkopírovali jste ID: ${params.value}`);
          console.log(`Copied ID: ${params.value}`);
        })
        .catch((err) => {
          console.error("Failed to copy ID:", err);
        });
    }
  };
  // Define columns for the DataGridx
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      editable: false,
      renderCell: (params: GridCellParams) => (
        <span style={{ cursor: "pointer" }}>{params.value as string}</span>
      ),
    },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "author", headerName: "Autor", width: 150, editable: true },
    { field: "category", headerName: "Kategorie", width: 85, editable: true },
    { field: "isbn", headerName: "ISBN", width: 120, editable: true },
    {
      field: "formaturita",
      headerName: "Maturitní",
      width: 85,
      editable: true,
      renderCell: (params: GridCellParams) => (
        <Checkbox
          checked={params.value as boolean}
          onChange={(event) => {
            const newValue = event.target.checked;
            const updatedRow = { ...params.row, formaturita: newValue };
            processRowUpdate(updatedRow, params.row);
          }}
        />
      ),
    },
    {
      field: "available",
      headerName: "Dostupná",
      width: 85,
      editable: true,
      renderCell: (params: GridCellParams) => (
        <Checkbox
          checked={params.value as boolean}
          onChange={(event) => {
            const newValue = event.target.checked;
            const updatedRow = { ...params.row, available: newValue };
            processRowUpdate(updatedRow, params.row);
          }}
        />
      ),
    },
    {
      field: "zpusob_ziskani",
      headerName: "Zpus. Získ.",
      width: 100,
      editable: true,
    },
    { field: "signatura", headerName: "Signatura", width: 90, editable: true },
  ];

  const filteredRows = books.filter((book) =>
    book.name.toLowerCase().includes(filterText.trim().toLowerCase())
  );

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const { id, ...updatedFields } = newRow;
    const updatedBook: Book = { ...oldRow, ...updatedFields } as Book;

    // Check for actual changes between the new and old rows
    const hasChanges = Object.keys(updatedFields).some(
      (key) => updatedFields[key] !== oldRow[key]
    );

    if (hasChanges) {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === updatedBook.id ? updatedBook : book
        )
      );

      setUpdatedBooks((prevUpdatedBooks) => {
        const existingIndex = prevUpdatedBooks.findIndex(
          (book) => book.id === updatedBook.id
        );
        if (existingIndex > -1) {
          const updatedList = [...prevUpdatedBooks];
          updatedList[existingIndex] = updatedBook;
          return updatedList;
        } else {
          return [...prevUpdatedBooks, updatedBook];
        }
      });
    }
    return updatedBook;
  };

  const handleCellEditStop: GridEventListener<"cellEditStop"> = (params) => {
    if (
      params.reason === "cellFocusOut" &&
      params.value !== params.row[params.field]
    ) {
      handleCellPaste(params);
    }
  };

  // Reset changes when clicking "Zrušit změny"
  const handleCancelChanges = () => {
    setBooks(originalBooks); // Restore the original books to context
    setUpdatedBooks([]); // Clear updatedBooks state
  };

  return (
    <Box className="mx-auto w-full p-2 ">
      <Typography variant="h4" gutterBottom>
        Prohlížeč knih
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={async () => {
          const [error, response] = await catchError(postDataToUpload(updatedBooks));
          console.log(response)
          alert(error ? error : response.data.message);
          setOriginalBooks(books);
          setUpdatedBooks([]); // Clear updatedBooks after confirming changes
        }}
        sx={{ margin: "2px" }}
        disabled={updatedBooks.length === 0}
      >
        Potvrdit změny
      </Button>
      <DangerButton
        variant="contained"
        color="error" // Danger button
        onClick={handleCancelChanges}
        sx={{ margin: "2px" }}
        disabled={updatedBooks.length === 0}
      >
        Zrušit změny
      </DangerButton>
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
          localeText={csCZ.components.MuiDataGrid.defaultProps.localeText}
          rows={filteredRows}
          columns={columns}
          onCellEditStop={handleCellEditStop} // Use cell edit stop to trigger paste
          onCellClick={handleCellClick} // Add cell click handler
          processRowUpdate={processRowUpdate}
          editMode="cell"
          ignoreDiacritics
          sx={{
            "& .MuiDataGrid-cell": {
              fontSize: "0.8rem", // Adjust the font size as needed
            },
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.8rem", // Adjust the font size for headers as well
            },
          }}
        />
      </Box>

      <UpdatedBooksList updatedBooks={updatedBooks} />
    </Box>
  );
};

export default BookGrid;
