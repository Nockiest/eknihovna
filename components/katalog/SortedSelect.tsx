"use client";
import { Autocomplete, TextField, CircularProgress, Button, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import InfoIcon from "@mui/icons-material/Info"; // Icon to signify examples

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

  const getRandomOptions = () => {
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  useEffect(() => {
    if (currentValue) {
      filterOptions(currentValue);
    } else if (options.length > 50) {
      setFilteredOptions(getRandomOptions());
    } else {
      setFilteredOptions(options);
    }
  }, [currentValue, options]);

  const filterOptions = (inputValue: string) => {
    setLoading(true);

    // Helper function to remove diacritics
    const normalizeString = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedInput = normalizeString(inputValue);

    const newFilteredOptions = options.filter((option) =>
      normalizeString(option).includes(normalizedInput)
    );

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
