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
  Typography,
} from "@mui/material";
import SearchBar from "./SearchBar";
import Image from "next/image";
import theme from "@/theme/theme";
import { Filters, FiltringValues } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";
import { getBooksByQuery } from "@/utils/fetchBooks";
import SortedGroupedSelect from "./SortedSelect";
import CategoryChip from "./CategoryChip";
import { checkIfIgnoredValue, isStringedBool } from "@/types/typeChecks";
import { translateBookKey } from "@/utils/translateBookKeys";

interface SearcherProps {}

const Searcher: React.FC<SearcherProps> = () => {
  const {
    isOpenSearcher,
    setOpenSearcher,
    filters,
    setFilters,
    filterValues,
  } = useSearchContext();

  const handleFilterChange = (
    name: keyof Filters,
    value: string | boolean | null
  ) => {
    setFilters((prevFilters: Filters) => {
      if (typeof value === "boolean" || value === null) {
        return {
          ...prevFilters,
          [name]: !value ? null : value,
        };
      } else if (Array.isArray(prevFilters[name])) {
        const arrayValue = prevFilters[name] as string[];
        if (!arrayValue.includes(value)) {
          return {
            ...prevFilters,
            [name]: [...arrayValue, value],
          };
        } else {
          return prevFilters; // Return the previous state if the value already exists
        }
      } else {
        return {
          ...prevFilters,
          [name]: value,
        };
      }
    });
  };
  const getFilteredOptions = (key: keyof FiltringValues) => {
    return filterValues[key].filter(
      (option) => !filters[key]?.includes(option)
    );
  };
  const removeFilter = (key: keyof Filters, value: string|boolean) => {
    setFilters((prevFilters: Filters) => {
      const currentFilter = prevFilters[key];

      if (Array.isArray(currentFilter)) {
        // Remove the specified value from the array
        const updatedArray = currentFilter.filter(
          (item: string) => item !== value
        );
        return {
          ...prevFilters,
          [key]: updatedArray.length > 0 ? updatedArray : null,
        };
      } else {
        // Set the value under the key to null
        return {
          ...prevFilters,
          [key]: null,
        };
      }
    });
  };

  const filterKeys = Object.keys(filters) as (keyof Filters)[];
  return (
    <Slide
      direction="up"
      className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-3/4"
      in={isOpenSearcher}
      mountOnEnter
      unmountOnExit
    >
      <Paper className={"relative"} elevation={3}>
        <Fab
          className="ml-auto mr-0"
          onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}
        >
          <Image src={"icon/cross.svg"} alt="cross" width={"32"} height={32} />
        </Fab>

        {filterKeys.map((key) => {
          const value = filters[key];

          if (checkIfIgnoredValue(value)) {
            return null
          }

            return (
              <div key={key}>
                <Typography variant="subtitle1">{translateBookKey(key)}</Typography>
                {typeof value === "string" || typeof value === 'boolean' ? (
                  <CategoryChip
                    key={key}
                    text={typeof value === 'boolean' ? translateBookKey(key) : value.toString()}
                    onRemove={() => removeFilter(key, value)}
                  />
                ) : (
                  Array.isArray(value) && value.map((item, index) => (
                    <CategoryChip
                      key={`${key}-${index}`}
                      text={item}
                      onRemove={() => removeFilter(key, item)}
                    />
                  ))
                )}
              </div>
            );
          // return null;
        })}
        <TextField
          label="Název"
          value={filters.name || ""}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          fullWidth
          margin="normal"
        />

        <SortedGroupedSelect
          options={getFilteredOptions("category")}
          label={"kategorie"}
          handleChange={(newVal) => handleFilterChange("category", newVal)}
        />

        <InputLabel shrink>
          Žánry: {filters.genres?.join(",") || "None"}
        </InputLabel>
        <SortedGroupedSelect
          options={getFilteredOptions("genres")}
          label={"žánry"}
          handleChange={(newVal) => handleFilterChange("genres", newVal)}
        />

        <InputLabel shrink>Autor: {filters.author || "None"}</InputLabel>
        <SortedGroupedSelect
          options={getFilteredOptions("author")}
          label={"autor"}
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
