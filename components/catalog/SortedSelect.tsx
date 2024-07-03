'use client'
import { Filters } from "@/types/types";
import { Autocomplete, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

type SortedGroupedSelectProps = {
  options: string[];
  handleChange: (key: string, value: string|boolean|null) => void;
  colName:string
};
interface GroupedCategories {
  [key: string]: any;
}
const SortedGroupedSelect: React.FC<SortedGroupedSelectProps> = ({
  options,
  colName,
  handleChange,
}) => {
  // Sort options alphabetically
  const sortedOptions = options.slice().sort((a, b) => a.localeCompare(b));
  const [currentValue, setCurrentValue] = useState<string|null>()
  // Group options if needed
  // For example, you can group them by the first letter
  const groupedValues: GroupedCategories = sortedOptions.reduce(
    (acc: GroupedCategories, value: string) => {
      const firstLetter = value[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(value);
      return acc;
    },
    {}
  );

  return (

<Autocomplete
  disablePortal
  id="combo-box-demo"
  options={sortedOptions}
  groupBy={(option) => option[0]}

  sx={{ width: 300 }}
  renderInput={(params) => <TextField {...params} label={colName} />}
  onChange={(event: any, newValue: string | null) => {
    handleChange(colName,newValue);
  }}
/>
  );
};

export default SortedGroupedSelect;
        // <optgroup label={letter} key={letter}>

 // <option
            //   // onClick={() => {
            //   //   setCurrentValue(value)
            //   //   // handleChange(colName, value);
            //   // }}
            //   key={value}
            //   value={value}
            // >
            //   {value}
            // </option>
        // </optgroup>

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
