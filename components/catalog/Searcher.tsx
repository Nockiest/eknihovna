"use client";
import React, { useEffect, useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import SearchBar from "./SearchBar";
import Image from "next/image";
import theme from "@/theme/theme";
import { Filters } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";
import { getBooksByQuery } from "@/utils/fetchBooks";
import SortedGroupedSelect from "./SortedSelect";


interface SearcherProps {}

const Searcher: React.FC<SearcherProps> = () => {
  const {
    isOpenSearcher,
    setOpenSearcher,
    filters,
    setFilters,
    books,
    setBooks,
    filterValues

  } = useSearchContext();

  const fetchFilteredBooks = async () => {
    try {
      const response = await getBooksByQuery(filters);
      const data = response;
      setBooks(data);
    } catch (error) {
      console.error("Error fetching filtered books:", error);
    }
  };

  const handleFilterChange = (name: string, value: string | boolean|null) => {
    console.log(name, value);
    setFilters((prevFilters: Filters) => ({
      ...prevFilters,
      [name]: value? value.toString(): null,
    }));
  };
  // const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // Split the input value into an array of genres
  //   const genresArray = e.target.value.split(",").map((genre) => genre.trim());
  //   // handleFilterChange("genres", genresArray);
  // };

  return (
    <Slide direction="up" in={isOpenSearcher} mountOnEnter unmountOnExit>
      <Paper className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-3/4" elevation={3}>
          <Fab  onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}>
            <Image
              src={"icon/cross.svg"}
              alt="cross"
              width={"32"}
              height={32}
            />
          </Fab>

        <SearchBar />

        <TextField
          label="Název"
          value={filters.name || ""}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          fullWidth
          margin="normal"
        />
        <SortedGroupedSelect options={filterValues.category}  colName={'category'}handleChange={handleFilterChange} />
        <SortedGroupedSelect options={filterValues.genres}  colName={'genres'} handleChange={handleFilterChange} />
        {/* <SortedGroupedSelect options={filterValues.name}  colName={'name'} handleChange={handleFilterChange} /> */}
        <SortedGroupedSelect options={filterValues.author}  colName={'author'} handleChange={handleFilterChange} />
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
              checked={Boolean(filters.formaturita)}
              onChange={(e) =>
                handleFilterChange("formaturita", e.target.checked)
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
