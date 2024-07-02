import React, { useMemo } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import { SelectChangeEvent } from '@mui/material/Select';
import theme from '../theme';
import { FormControl, InputLabel, Typography } from '@mui/material';

interface SortedSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (event: SelectChangeEvent<string>) => void;
  fullWidth?: boolean;
  margin?: 'dense' | 'none' | 'normal';
}

const groupAndSortOptions = (options: string[]) => {
  const groupedOptions: { [key: string]: string[] } = {};
  options.forEach((option) => {
    const letter = option[0].toUpperCase();
    if (!groupedOptions[letter]) {
      groupedOptions[letter] = [];
    }
    groupedOptions[letter].push(option);
  });

  Object.keys(groupedOptions).forEach((letter) => {
    groupedOptions[letter].sort();
  });

  return groupedOptions;
};

const SortedSelect: React.FC<SortedSelectProps> = ({
  label,
  value,
  options,
  onChange,
  fullWidth = false,
  margin = 'none',
}) => {
  const groupedOptions = useMemo(() => groupAndSortOptions(options), [options]);

  return (
    <FormControl fullWidth={fullWidth} margin={margin}>
      <InputLabel sx={{color:theme.palette.text.primary}}>{label}</InputLabel>
      <Select value={value} onChange={onChange} displayEmpty>
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
        {Object.keys(groupedOptions).map((letter) => (
          <React.Fragment key={letter}>
            <ListSubheader>{letter}</ListSubheader>
            {groupedOptions[letter].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </React.Fragment>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortedSelect;


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