import { Filters } from '@/types/types';
import { MenuItem, Select } from '@mui/material';
import React from 'react';

type SortedGroupedSelectProps = {
    categories: string[];
    filters: Filters;
    handleFilterChange: (key: string, value: string) => void;
};
interface GroupedCategories {
  [key: string]: any;
}
const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({ categories, filters, handleFilterChange }) => {
  // Sort categories alphabetically
  const sortedCategories = categories.slice().sort((a, b) => a.localeCompare(b));

  // Group categories if needed
  // For example, you can group them by the first letter
  const groupedCategories: GroupedCategories = sortedCategories.reduce((acc: GroupedCategories, category: string) => {
    const firstLetter = category[0].toUpperCase();
    console.log(acc, category);
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
  // onChange={(e) => handleFilterChange("category", e.target.value || "")}
  fullWidth
  margin="dense"
>
     {Object.keys(groupedCategories).map((letter) => (
    <optgroup label={letter} key={letter}>

      {groupedCategories[letter].map((category:string, index:number) => (
        <option onClick={() => { handleFilterChange("category", category )}} key={category} value={category}>
          {category}
        </option>
      ))}
    </optgroup>
  ))}
    </Select>
  );
};



export default SortedGroupedSelect;


// const SortedSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options, fullWidth = true, margin = 'dense' }) => {
//   const groupedOptions = useMemo(() => groupAndSortOptions(options), [options]);

//   return (
//     <Select
//       value={value}
//       onChange={onChange}
//       fullWidth={fullWidth}
//       displayEmpty
//     >
//       <MenuItem value="">
//         <em>Žádný</em>
//       </MenuItem>
//       {Object.keys(groupedOptions).map((letter) => (
//         <React.Fragment key={letter}>
//           <Typography>{letter}</Typography>
//           {groupedOptions[letter].map((option) => (
//             <MenuItem key={option} value={option}>
//               {option}
//             </MenuItem>
//           ))}
//         </React.Fragment>
//       ))}
//     </Select>
//   );
// };