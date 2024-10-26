"use client";
import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

interface SortedGroupedSelectProps {
  options:string[]
  label: string;
  handleChange: (value: string | null) => void;
  handleInputChange?:(value: string | null) => void;
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  options,
  label,
  handleChange,
  handleInputChange,
}) => {
  const sortedOptions = options
    ?.filter((item): item is string => {
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
        overflowY: 'auto',
      }}
      renderInput={(params) => <TextField className="text-black" sx={{ color: 'black' }} {...params} label={label} />}
      onChange={(e, newVal) => {
        handleChange(newVal);
        setCurrentValue(newVal);
      }}
      onInputChange={(e, newInputValue) => {
        setCurrentValue(newInputValue);
        handleInputChange && handleInputChange(newInputValue)
      }}
    />
  );
};

export default SortedGroupedSelect;
