"use client";
import React from "react";
import {
  Slide,
  Paper,
  Checkbox,
  FormControlLabel,
  Fab,
  InputLabel,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import Image from "next/image";
import theme from "@/theme/theme";
import { Filters, FiltringValues } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";
import SortedGroupedSelect from "./SortedSelect";
import CategoryChip from "./CategoryChip";
import { checkIfIgnoredValue } from "@/types/typeChecks";
import { translateBookKey } from "@/utils/translateBookKeys";
import Close from "@mui/icons-material/Close";
import FilterLister from "./FilterLister";
type SearcherProps = {};
export const Searcher: React.FC<SearcherProps> = () => {
  const { isOpenSearcher, setOpenSearcher, filters, setFilters, filterValues } =
    useSearchContext();

  const handleFilterChange = (
    name: keyof Filters,
    value: string | boolean | null
  ) => {
    setFilters((prevFilters: Filters) => {
      console.log(prevFilters[name], Array.isArray(prevFilters[name]), value);
      if (
        (typeof value === "boolean" || value === null) &&
        !Array.isArray(prevFilters[name])
      ) {
        return {
          ...prevFilters,
          [name]: !value ? null : value,
        };
      }
      if (Array.isArray(prevFilters[name])) {
        const arrayValue = prevFilters[name] as string[];
        if (
          typeof value === "boolean" ||
          value === null ||
          value === undefined
        ) {
          console.error("value has unexpected value: " + value);
          return {
            ...prevFilters,
            [name]: [],
          };
        }

        if (!arrayValue.includes(value)) {
          return {
            ...prevFilters,
            [name]: [...arrayValue, value],
          };
        } else {
          return prevFilters;
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
  
  return (
    <Slide
      direction="up"
      className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-3/4"
      in={isOpenSearcher}
      mountOnEnter
      unmountOnExit
    >
      <Paper className={"relative"} elevation={3}>
        <IconButton
          className="absolute top-0 overflow-y-auto right-0 m-2"
          onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}
        >
          <Close />
        </IconButton>
        {/* <FilterLister filters={filters} removeFilter={removeFilter} /> */}

        <Box className="m-2 mt-8 center-flex flex-col mx-4">
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
        </Box>

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