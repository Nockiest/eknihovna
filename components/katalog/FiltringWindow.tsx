"use client";
import React, { useEffect, useState } from "react";
import {
  Slide,
  Paper,
  Checkbox,
  FormControlLabel,
  InputLabel,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import theme from "@/theme/theme";
import { Filters, FiltringValues } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";
import SortedGroupedSelect from "./SortedSelect";
import Close from "@mui/icons-material/Close";
import FilterLister from "./FilterLister";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import useDebounce from "@/utils/hooks/useDebounce";
import MultipleSelect from "./MultipleSelect";

type SearcherProps = {};
export const FiltringWindow: React.FC<SearcherProps> = () => {
  const {
    isOpenSearcher,
    setOpenSearcher,
    activeFilters,
    setActiveFilters,
    filterValues,
  } = useSearchContext();

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10) || 1;
  const pathname = usePathname();
  const router = useRouter();
  const changePage = (newPage: number) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("page", newPage.toString());
    router.push(`${pathname}?${currentQuery.toString()}`);
  };
  const handleFilterChange = (
    filterName: keyof Filters,
    value: string | boolean | null
  ) => {
    console.log(filterName, value);
    const makeNewFilters = () => {
      if (
        (typeof value === "boolean" || value === null) &&
        !Array.isArray(activeFilters[filterName])
      ) {
        return {
          ...activeFilters,
          [filterName]: !value ? null : value,
        };
      }
      if (Array.isArray(activeFilters[filterName])) {
        const arrayValue = activeFilters[filterName] as string[];
        if (
          typeof value === "boolean" ||
          value === null ||
          value === undefined
        ) {
          console.error("value has unexpected value: " + value);
          return {
            ...activeFilters,
            [filterName]: [],
          };
        }

        if (!arrayValue.includes(value)) {
          return {
            ...activeFilters,
            [filterName]: [...arrayValue, value],
          };
        } else {
          return activeFilters;
        }
      } else {
        return {
          ...activeFilters,
          [filterName]: value,
        };
      }
    };
    const newFilters = makeNewFilters();
    setActiveFilters(newFilters);
  };
  const getFilteredOptions = (key: keyof FiltringValues) => {
    return filterValues[key]?.filter(
      (option) => !activeFilters[key]?.includes(option)
    );
  };

  return (
    <Slide
      direction="up"
      className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-full  bg-white"
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

        <Stack spacing={2} className="m-2 mt-8 center-flex flex-col mx-4">
          {/* <InputLabel shrink>Název: {activeFilters.name || "None"}</InputLabel> */}
          <SortedGroupedSelect
            options={getFilteredOptions("name")}
            label={"název"}
            handleChange={(newVal) => handleFilterChange("name", newVal)}
          />

          <SortedGroupedSelect
            options={getFilteredOptions("category")}
            label={"kategorie"}
            handleChange={(newVal) => handleFilterChange("category", newVal)}
          />

          {/* <InputLabel shrink>
            Žánry: {activeFilters.genres?.join(",") || "None"}
          </InputLabel> */}
          <SortedGroupedSelect
            options={getFilteredOptions("genres")}
            label={"žánry"}
            handleChange={(newVal) => handleFilterChange("genres", newVal)}
          />

          {/* <InputLabel shrink>
            Autor: {activeFilters.author || "None"}
          </InputLabel> */}
          <SortedGroupedSelect
            options={getFilteredOptions("author")}
            label={"autor"}
            handleChange={(newVal) => handleFilterChange("author", newVal)}
          />
          {/* <MultipleSelect
           options={getFilteredOptions("author")}
           label={"autor"}
           handleChange={(newVal) => {return}}
           /> */}
        </Stack>

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

// const [debouncedFilters, setDebouncedFilters] =
//   useState<Filters>(activeFilters);
// const debouncedActiveFilters = useDebounce(debouncedFilters, 500); // Adjust the delay as needed
// useEffect(() => {
//   console.log(debouncedActiveFilters)
//   changePage(1)
//   setActiveFilters(debouncedActiveFilters);
// }, [debouncedActiveFilters]);
