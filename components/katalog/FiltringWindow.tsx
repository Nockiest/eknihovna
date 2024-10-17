"use client";
import React from "react";
import {
  Slide,
  Paper,
  Checkbox,
  FormControlLabel,
  InputLabel,
  IconButton,
  Box,
} from "@mui/material";
import theme from "@/theme/theme";
import { Filters, FiltringValues } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";
import SortedGroupedSelect from "./SortedSelect";
import Close from "@mui/icons-material/Close";
import FilterLister from "./FilterLister";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type SearcherProps = {};
export const FiltringWindow: React.FC<SearcherProps> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpenSearcher, setOpenSearcher, activeFilters, setFilters, filterValues } =
    useSearchContext();

  const changePage = (newPage: number) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("page", newPage.toString());
    router.push(`${pathname}?${currentQuery.toString()}`);
  };
  const handleFilterChange = (
    name: keyof Filters,
    value: string | boolean | null
  ) => {
    changePage(1);
    updateURLWithFilters()
    console.log(extractFiltersFromURL())
    setFilters((prevFilters: Filters) => {
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
    return filterValues[key]?.filter(
      (option) => !activeFilters[key]?.includes(option)
    );
  };
  const updateURLWithFilters = () => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    Object.keys(activeFilters).forEach((key) => {
      const value = activeFilters[key as keyof typeof activeFilters];
      if (value !== null && value !== undefined) {
        currentQuery.set(key, Array.isArray(value) ? value.join(',') : value.toString());
      }
    });
    router.push(`${pathname}?${currentQuery.toString()}`);
  };
  const extractFiltersFromURL = () => {
      const currentQuery = new URLSearchParams(searchParams.toString());
      Object.keys(activeFilters).forEach((key) => {
        const value = activeFilters[key as keyof typeof activeFilters];
        if (value !== null && value !== undefined) {
          currentQuery.set(key, Array.isArray(value) ? value.join(',') : value.toString());
        }
      });
      return `${pathname}?${currentQuery.toString()}`;

  };
  return (
    <Slide
      direction="up"
      className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-3/4  bg-white"
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
        <FilterLister />

        <Box className="m-2 mt-8 center-flex flex-col mx-4">
          <SortedGroupedSelect
            options={getFilteredOptions("category")}
            label={"kategorie"}
            handleChange={(newVal) => handleFilterChange("category", newVal)}
          />

          <InputLabel shrink>
            Žánry: {activeFilters.genres?.join(",") || "None"}
          </InputLabel>
          <SortedGroupedSelect
            options={getFilteredOptions("genres")}
            label={"žánry"}
            handleChange={(newVal) => handleFilterChange("genres", newVal)}
          />

          <InputLabel shrink>Autor: {activeFilters.author || "None"}</InputLabel>
          <SortedGroupedSelect
            options={getFilteredOptions("author")}
            label={"autor"}
            handleChange={(newVal) => handleFilterChange("author", newVal)}
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(activeFilters.available)}
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
              checked={Boolean(activeFilters.formaturita)}
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
