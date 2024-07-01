import React, { useMemo } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import { SelectChangeEvent } from '@mui/material/Select';
import theme from '../theme';

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: string[];
  fullWidth?: boolean;
  margin?:  'none' | 'dense' |'undefined';
}

const groupAndSortOptions = (options: string[]): { [key: string]: string[] } => {
  const groupedOptions: { [key: string]: string[] } = {};
console.log(options)
  options.sort().forEach((option) => {

    const firstLetter = option[0].toUpperCase();
    if (!groupedOptions[firstLetter]) {
      groupedOptions[firstLetter] = [];
    }
    groupedOptions[firstLetter].push(option);
  });

  return groupedOptions;
};

const SortedSelect: React.FC<CustomSelectProps> = ({ label, value, onChange, options, fullWidth = true, margin = 'dense' }) => {
  const groupedOptions = useMemo(() => groupAndSortOptions(options), [options]);

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      margin={margin}
    //   sx={{
    //     '& .MuiOutlinedInput-root': {
    //       '& fieldset': {
    //         borderColor: theme.palette.primary.main,
    //       },
    //       '&:hover fieldset': {
    //         borderColor: theme.palette.primary.main,
    //       },
    //       '&.Mui-focused fieldset': {
    //         borderColor: theme.palette.primary.main,
    //       },
    //       color: theme.palette.primary.main,
    //     },
    //     '& .MuiInputLabel-root': {
    //       color: theme.palette.primary.main,
    //     },
    //     '& .MuiInputLabel-root.Mui-focused': {
    //       color: theme.palette.primary.main,
    //     },
    //   }}
      displayEmpty
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
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
  );
};

export default SortedSelect
