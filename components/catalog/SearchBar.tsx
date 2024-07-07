import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
const useStyles = makeStyles({
  searchBox: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '0 10px',
      margin: '16px',
      width: 'auto'
    },
    '& .MuiOutlinedInput-input': {
      padding: '10px 0',
    },
  },
});

interface SearchAutocompleteProps {
  onInputChange: (inputValue: string) => void;
  bookNames: string[];
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onInputChange, bookNames }) => {
  const classes = useStyles();
  const [query, setQuery] = useState<string>('');

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={bookNames}
      groupBy={(option) => option[0]}
      value={query}
      onInputChange={(e, newInputValue) => {
        setQuery(newInputValue);
        onInputChange(newInputValue); // Update the input value when typing
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Vyhldat knihu..."
          className={classes.searchBox}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
export default SearchAutocomplete;
