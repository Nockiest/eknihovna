"use client";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";
import React, { useState, useEffect, useTransition } from "react";
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
  const [loading, startLoading] = useTransition( );

  useEffect(() => {
    if (currentValue) {
      startLoading( () => {filterOptions(currentValue) })
    } else if (options.length == 0) {
      return;
    } else {
      // Filter out predefined suggestions from the options before selecting random options
      const availableOptions = predefinedSuggestions
        ? options.filter((option) => !predefinedSuggestions.includes(option))
        : options;

      // Get 5 random options from the filtered list or all 10 if there are no predefined suggestions
      const randomOptions = getRandomArrayElements(
        shuffleArray(availableOptions)
      ).slice(0, predefinedSuggestions ? 5 : 10);

      // Combine predefined suggestions with random options if predefined suggestions are provided
      const combinedOptions = predefinedSuggestions
        ? [...shuffleArray(predefinedSuggestions).slice(0, 5), ...randomOptions]
        : randomOptions;

      setFilteredOptions(shuffleArray(combinedOptions));
    }
  }, [currentValue, options, predefinedSuggestions]);

  const filterOptions = (inputValue: string) => {
    const normalizeString = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const normalizedInput = normalizeString(inputValue);
    const newFilteredOptions = options
      .filter((option) => normalizeString(option).includes(normalizedInput))
      .slice(0, 10); // Limit to top 10 results

    setFilteredOptions(newFilteredOptions);
  };

  // Render option with highlighted matching substring
  const renderHighlightedOption = (option: string, query: string | null) => {
    if (!query) return option;

    const matchIndex = option.toLowerCase().indexOf(query.toLowerCase());
    if (matchIndex === -1) return option;

    const matchText = option.slice(matchIndex, matchIndex + query.length);

    const parts = option.split(new RegExp(`(${matchText})`, "gi")); // Split text into matched and unmatched parts
    console.log(parts)
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === matchText.toLowerCase() ? (
            <strong key={index}>{part}</strong> // Bold matching parts
          ) : (
            <span key={index}>{part}</span> // Regular text for non-matching parts
          )
        )}
      </span>
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
        }}
        ListboxProps={{
          style: {
            maxHeight: filteredOptions.length
              ? `${filteredOptions.length * 48}px`
              : "auto", // Adjust height dynamically
            overflow: "hidden", // Prevent scrollbar from showing
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
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <li
              key={option}
              {...restProps}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {options.length > 50 && !currentValue && (
                <InfoIcon sx={{ marginRight: 1 }} />
              )}
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
