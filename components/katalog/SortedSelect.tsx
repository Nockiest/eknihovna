"use client";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";

interface SortedGroupedSelectProps {
  options: string[];
  label: string;
  handleChange: (value: string | null) => void;
  handleInputChange?: (value: string | null) => void;
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  options,
  label,
  handleChange,
  handleInputChange,
}) => {
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [loading, setLoading] = useState(false);

  // Debounce function to limit the rate of search
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to filter options based on input
  const filterOptions = (inputValue: string) => {
    setLoading(true);
    const lowercasedInput = inputValue.toLowerCase();
    const newFilteredOptions = options.filter((option) =>
      option.toLowerCase().includes(lowercasedInput)
    );
    setFilteredOptions(newFilteredOptions);
    setLoading(false);
  };

  // Using debounce to optimize the filtering function
  const debouncedFilterOptions = debounce(filterOptions, 300);

  useEffect(() => {
    if (currentValue) {
      debouncedFilterOptions(currentValue);
    } else {
      setFilteredOptions(options); // Reset to original options if input is empty
    }
  }, [currentValue, options]); // Adding options to dependencies

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={filteredOptions.slice(0,50)}
      value={currentValue}
      sx={{
        minWidth: 300,
        width: "full",
        flexGrow: 1,
        overflowY: "auto",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{ color: "black" }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      onChange={(e, newVal) => {
        handleChange(newVal);
        setCurrentValue(newVal);
      }}
      onInputChange={(e, newInputValue) => {
        setCurrentValue(newInputValue);
        handleInputChange && handleInputChange(newInputValue);
      }}
      noOptionsText="Žádné možnosti"
      isOptionEqualToValue={(option, value) => option.includes(value)} // Custom equality check
    />
  );
};

export default SortedGroupedSelect;
