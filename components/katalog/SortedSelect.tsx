"use client";
import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

interface SortedGroupedSelectProps {
  options: Array<string | null>;
  label: string;
  handleChange: (value: string | null) => void;
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  options,
  label,
  handleChange,
}) => {
  // Sort options alphabetically
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
        width: 300,
        maxHeight: 300, // Set a maximum height for the dropdown list
        overflowY: 'auto', // Enable vertical scrolling
        textColor: 'black'
      }}
      renderInput={(params) => <TextField className="text-black" sx={{ color: 'black' }} { ...params} label={label} />}
      onChange={(e, newVal) => {
        handleChange(newVal);
        // if (newVal !== null) {
        setCurrentValue(""); // Clear the input field only when an option is selected
        // }
      }}
      onInputChange={(e, newInputValue) => {
        setCurrentValue(newInputValue); // Update the input value when typing
      }}
    />
  );
};

export default SortedGroupedSelect;
