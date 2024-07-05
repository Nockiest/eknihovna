'use client'
import { Autocomplete,    TextField, Typography } from "@mui/material";
import React, { useState } from "react";

interface SortedGroupedSelectProps {
  options: string[];
  label: string;
  handleChange: (value: string | null) => void;
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  options,
  label,
  handleChange,
}) => {
  // Sort options alphabetically
  const sortedOptions = options.slice().sort((a, b) => a.localeCompare(b));
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={sortedOptions}
      groupBy={(option) => option[0]}
      value={currentValue}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
      onChange={(e, newVal) => {
        handleChange(newVal);
        if (newVal !== null) {
          setCurrentValue(''); // Clear the input field only when an option is selected
        }
      }}
      onInputChange={(e, newInputValue) => {
        setCurrentValue(newInputValue); // Update the input value when typing
      }}
    />
  );
};

export default SortedGroupedSelect;
