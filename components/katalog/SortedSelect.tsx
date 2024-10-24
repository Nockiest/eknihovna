"use client";
import { useSearchContext } from "@/app/katalog/context";
import {   useUploadContext } from "@/app/upload/context";
import { FiltringValues } from "@/types/types";
import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";

interface SortedGroupedSelectProps {
  // filterName:  keyof FiltringValues;
  // getFilteredOptions: (key: keyof FiltringValues)=>string[]
  options:string[]
  label: string;
  handleChange: (value: string | null) => void;
  context?: 'katalog'|  'upload'
}

const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  // getFilteredOptions,
  options,
  label,
  handleChange,
  context = "katalog", // Default to using the default context
}) => {
  // const  SearchContext = context === "katalog" ? useSearchContext : useUploadContext;
  // const { activeFilters,   } = SearchContext();



  // const options = getFilteredOptions(filterName);
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
      }}
    />
  );
};

export default SortedGroupedSelect;
