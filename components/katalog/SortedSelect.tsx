"use client";
import { useSearchContext } from "@/app/katalog/context";
import { FiltringValues } from "@/types/types";
import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

interface SortedGroupedSelectProps {
  filterName:  keyof FiltringValues;
  label: string;
  handleChange: (value: string | null) => void;
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  filterName,
  label,
  handleChange,
}) => {
  // Sort options alphabetically
  const {activeFilters,filterValues} =  useSearchContext()

  const getFilteredOptions = (key: keyof FiltringValues) => {
    return filterValues[key]?.filter(
      (option) => !activeFilters[key]?.includes(option)
    );
  };
  const options = getFilteredOptions(filterName)
  const sortedOptions = options
    ?.filter((item): item is string => {
      // Ensure item is a string and not null or undefined
      return typeof item === "string" && item !== null && item !== undefined;
    })
    .sort((a, b) => a.localeCompare(b));
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={sortedOptions}
      value={currentValue}
      sx={{
        minWidth: 300,
        width: 'full',
        flexGrow: 1,
        overflowY: 'auto', // Enable vertical scrolling
      }}
      renderInput={(params) => <TextField className="text-black" sx={{ color: 'black' }} { ...params} label={label} />}
      onChange={(e, newVal) => {
        handleChange(newVal);
        setCurrentValue(newVal); // Update the input value when typing
        // if (newVal !== null) {
        // setCurrentValue(""); // Clear the input field only when an option is selected
        // }
      }}
      onInputChange={(e, newInputValue) => {
        setCurrentValue(newInputValue); // Update the input value when typing
      }}
    />
  );
};

export default SortedGroupedSelect;
