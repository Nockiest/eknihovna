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
  Box,
  InputLabel,
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
    filterValues,
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

  const handleFilterChange = (name: keyof Filters, value: string | boolean | null) => {
    setFilters((prevFilters: Filters) => {
      if (typeof value === 'boolean' || value === null) {
        return {
          ...prevFilters,
          [name]: !value ? null : value.toString()
        };
      } else if (Array.isArray(prevFilters[name])) {
        return {
          ...prevFilters,
          [name]: [...prevFilters[name] as string[], value]
        };
      } else {
        return {
          ...prevFilters,
          [name]: value.toString()
        };
      }
    });
  };

  return (
    <Slide
      direction="up"
      className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-3/4"
      in={isOpenSearcher}
      mountOnEnter
      unmountOnExit
    >
      <Paper className={"relative"} elevation={3}>
        {/* <Box className="border-b-0 border-2 border-solid rounded z-1 mb-16 left-12 absolute border-black pb-2" onClick={() => {
          setOpenSearcher(!isOpenSearcher);
        }}>
          Filtry
        </Box> */}
        <Fab
          className="ml-auto mr-0"
          onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}
        >
          <Image src={"icon/cross.svg"} alt="cross" width={"32"} height={32} />
        </Fab>

        {/* <SearchBar /> */}

        <InputLabel shrink>Název: {filters.name || "None"}</InputLabel>
        <TextField
          label="Název"
          value={filters.name || ""}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* <InputLabel shrink>Kategorie: {filters.category?.join(',') || "None"}</InputLabel> */}
        <SortedGroupedSelect
          options={filterValues.category}
          colName={"category"}
          handleChange={(newVal) => handleFilterChange("category", newVal)}
        />

        <InputLabel shrink>Žánry: {filters.genres?.join(',') || "None"}</InputLabel>
        <SortedGroupedSelect
          options={filterValues.genres}
          colName={"genres"}
          handleChange={(newVal) => handleFilterChange("genres", newVal)}
        />

        <InputLabel shrink>Autor: {filters.author || "None"}</InputLabel>
        <SortedGroupedSelect
          options={filterValues.author}
          colName={"author"}
          handleChange={(newVal) => handleFilterChange("author", newVal)}
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

      </Paper>
    </Slide>
  );
};

export default Searcher;
