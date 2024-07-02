import { Filters } from '@/types/types';
import { MenuItem, Select } from '@mui/material';
import React from 'react';

type SortedGroupedSelectProps = {
    categories: string[];
    filters: Filters;
    handleFilterChange: (key: string, value: string) => void;
};
interface GroupedCategories {
    [key: string]: string[];
  }
const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({ categories, filters, handleFilterChange }) => {
  // Sort categories alphabetically
  const sortedCategories = categories.slice().sort();

  // Group categories if needed
  // For example, you can group them by the first letter
  const groupedCategories: GroupedCategories = sortedCategories.reduce((acc: GroupedCategories, category: string) => {
    const firstLetter: string = category[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {});

  return (
    <Select
      label="Kategorie"
      value={filters.category || ""}
      onChange={(e) => handleFilterChange("category", e.target.value as string)}
      fullWidth
      margin="dense"
    >
      {Object.keys(groupedCategories).map((letter:string) => (
        <optgroup label={letter} key={letter}>
          {groupedCategories[letter].map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </optgroup>
      ))}
    </Select>
  );
};

export default SortedGroupedSelect;
