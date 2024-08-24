'use client'
import { falsyValues } from "@/data/values";
import { Autocomplete,    TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface SortedGroupedSelectProps {
  options: Array<string|null>;
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
  .filter((item): item is string => {
    // Ensure item is a string and not null or undefined
    return typeof item === 'string' && item !== null && item !== undefined;
  })
  .sort((a, b) => a.localeCompare(b));
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={sortedOptions}
      value={currentValue}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(e, newVal) => {
        handleChange(newVal);
        // if (newVal !== null) {
          setCurrentValue(''); // Clear the input field only when an option is selected
        // }
      }}
      onInputChange={(e, newInputValue) => {
        setCurrentValue(newInputValue); // Update the input value when typing
      }}
    />
  );
};

export default SortedGroupedSelect;
