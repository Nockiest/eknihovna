"use client";
import React, { useState } from "react";
import {
  Slide,
  Paper,
  useTheme,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Fab,
  TextField,
  Button,
} from "@mui/material";
import SearchBar from "./SearchBar";
import Image from "next/image";
import theme from "@/theme/theme";
import {  Filters  } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";
import { getBooksByQuery } from "@/utils/fetchBooks";

interface SearcherProps {
}

const Searcher: React.FC<SearcherProps> = () => {
  const classes = useTheme();
  const {
    isOpenSearcher,
    setOpenSearcher,
    filters,
    setFilters,
    books,
    setBooks,
  } = useSearchContext();

  const fetchFilteredBooks = async () => {
    try {
      const response = getBooksByQuery(filters)
      const data = response.data;
      setBooks(data);
    } catch (error) {
      console.error("Error fetching filtered books:", error);
    }
  };

  const handleFilterChange = (name: string, value: string | boolean) => {
    setFilters((prevFilters: Filters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Split the input value into an array of genres
    const genresArray = e.target.value.split(",").map((genre) => genre.trim());
    // handleFilterChange("genres", genresArray);
  };
  return (
    <Slide direction="up" in={isOpenSearcher} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        style={{
          position: "fixed",
          bottom: 0,
          left: "16px",
          right: "16px",
          zIndex: 999,
          padding: "16px",
          height: "75vh",
        }}
      >
        <button
          onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}
        >
          <Fab>
            <Image
              src={"icon/cross.svg"}
              alt="cross"
              width={"32"}
              height={32}
            />
          </Fab>
        </button>

        <SearchBar />

        <TextField
          label="Název"
          value={filters.name || ""}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Žánr"
          value={(filters.genres || []) }
          onChange={handleGenresChange}
          fullWidth
          margin="normal"
        />

        <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(filters.available)}
                onChange={(e) =>
                  handleFilterChange("available", e.target.checked)
                }
              />
            }
            label="Dostupnost"
            sx={{
              color: theme.palette.primary.main,
              "&.Mui-checked": {
                color: theme.palette.secondary.main,
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(filters.forMaturita)}
                onChange={(e) =>
                  handleFilterChange("forMaturita", e.target.checked)
                }
              />
            }
            label="Maturitní"
            sx={{
              color: theme.palette.primary.main,
              "&.Mui-checked": {
                color: theme.palette.secondary.main,
              },
            }}
          />
    <Button
          variant="contained"
          color="primary"
          onClick={fetchFilteredBooks}
          style={{ marginTop: "16px" }}
        >
          POUŽÍT FILTRY
        </Button>
      </Paper>

    </Slide>
  );
};

export default Searcher;
