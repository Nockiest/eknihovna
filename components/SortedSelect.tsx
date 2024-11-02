"use client";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info"; // Icon to signify examples

import { getRandomArrayElements, shuffleArray } from "@/utils/arrayUtils";

interface SortedGroupedSelectProps {
  options: string[];
  predefinedSuggestions?: string[]; // New prop for predefined suggestions
  label: string;
  handleChange: (value: string | null) => void;
  handleInputChange?: (value: string | null) => void;
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  options,
  predefinedSuggestions,
  label,
  handleChange,
  handleInputChange,
}) => {
  const [currentValue, setCurrentValue] = useState<string | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentValue) {
      filterOptions(currentValue);
    } else {
      // Filter out predefined suggestions from the options before selecting random options
      const availableOptions = predefinedSuggestions? options.filter(
        (option) => !predefinedSuggestions.includes(option)
      ): options

      // Get 5 random options from the filtered list or all 10 if there are no predefined suggestions
      const randomOptions = getRandomArrayElements(shuffleArray(availableOptions)).slice(0, predefinedSuggestions ? 5 : 10);

      // Combine predefined suggestions with random options if predefined suggestions are provided
      const combinedOptions = predefinedSuggestions
        ? [...shuffleArray(predefinedSuggestions).slice(0, 5), ...randomOptions]
        : randomOptions;

      setFilteredOptions(shuffleArray(combinedOptions));
    }
  }, [currentValue, options, predefinedSuggestions]);


  const filterOptions = (inputValue: string) => {
    setLoading(true);

    // Helper function to remove diacritics
    const normalizeString = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedInput = normalizeString(inputValue);
    debugger
    const newFilteredOptions = options
      .filter((option) => normalizeString(option).includes(normalizedInput))
      .slice(0, 10); // Limit to top 10 results

    setFilteredOptions(newFilteredOptions);
    setLoading(false);
  };

  // Render option with highlighted matching substring
  const renderHighlightedOption = (option: string, query: string | null) => {
    if (!query) return option;

    const matchIndex = option.toLowerCase().indexOf(query.toLowerCase());
    if (matchIndex === -1) return option;

    const beforeMatch = option.slice(0, matchIndex);
    const matchText = option.slice(matchIndex, matchIndex + query.length);
    const afterMatch = option.slice(matchIndex + query.length);

    return (
      <>
        <span style={{ whiteSpace: "pre-wrap" }}>{beforeMatch}</span>
        <strong style={{ whiteSpace: "pre-wrap" }}>{matchText}</strong>
        <span style={{ whiteSpace: "pre-wrap" }}>{afterMatch}</span>
      </>
    );
  };

  return (
    <Box className="w-full">
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={filteredOptions}
        value={currentValue}
        sx={{
          minWidth: 300,
          width: "full",
          flexGrow: 1,
          "& .MuiAutocomplete-listbox": {
            maxHeight: 250, // Set maximum height to avoid overflow
            overflow: "auto",
          },
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
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <li key={option} {...restProps}>
              {options.length > 50 && !currentValue && <InfoIcon sx={{ marginRight: 1 }} />}
              {renderHighlightedOption(option, currentValue)}
            </li>
          );
        }}
        onChange={(e, newVal) => {
          handleChange(newVal);
          setCurrentValue(newVal);
        }}
        onInputChange={(e, newInputValue) => {
          setCurrentValue(newInputValue);
          handleInputChange && handleInputChange(newInputValue);
        }}
        noOptionsText="Žádné možnosti"
        isOptionEqualToValue={(option, value) => option.includes(value)}
      />
    </Box>
  );
};

export default SortedGroupedSelect;
