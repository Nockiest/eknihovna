// import React, { useState } from 'react';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import { makeStyles } from '@mui/styles';
// import { InputAdornment } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// const useStyles = makeStyles({
//   searchBox: {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '25px',
//       padding: '0 10px',
//       margin: '16px',
//       width: 'auto'
//     },
//     '& .MuiOutlinedInput-input': {
//       padding: '10px 0',
//     },
//   },
// });

// interface SearchAutocompleteProps {
//   onInputChange: (inputValue: string) => void;
//   bookNames: string[];
// }

// const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onInputChange, bookNames }) => {
//   const classes = useStyles();
//   const [query, setQuery] = useState<string>('');

//   return (
//     <Autocomplete
//       disablePortal
//       id="combo-box-demo"
//       className=''
//       options={bookNames}
//       groupBy={(option) => option[0]}
//       value={query}
//       onInputChange={(e, newInputValue) => {
//         setQuery(newInputValue);
//         onInputChange(newInputValue); // Update the input value when typing
//       }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="outlined"
//           placeholder="Vyhldat knihu..."
//           className={classes.searchBox}
//           InputProps={{
//             ...params.InputProps,
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       )}
//     />
//   );
// };
// export default SearchAutocomplete;

import React, { useState, useMemo, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import { makeStyles } from '@mui/styles';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash';
import { FixedSizeList } from 'react-window';
import getRelevancy from '@/utils/searchingUtils';

// const useStyles = makeStyles({
//   searchBox: {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '25px',
//       padding: '0 10px',
//       margin: '16px',
//       width: 'auto'
//     },
//     '& .MuiOutlinedInput-input': {
//       padding: '10px 0',
//     },
//   },
// });

interface SearchAutocompleteProps {
  onInputChange: (inputValue: string) => void;
  bookNames: string[];
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onInputChange, bookNames }) => {
  // const classes = useStyles();
  const [query, setQuery] = useState<string>('');

  // Debounce the input change handler to limit the number of calls
  const debouncedOnInputChange = useMemo(
    () => debounce((value: string) => {
      onInputChange(value);
    }, 300),
    [onInputChange]
  );

  const handleInputChange = useCallback(
    (e: React.SyntheticEvent, newInputValue: string) => {
      setQuery(newInputValue);
      debouncedOnInputChange(newInputValue); // Update the input value when typing
    },
    [debouncedOnInputChange]
  );

  const filteredBookNames = useMemo(
    () => bookNames.filter((bookName) => getRelevancy(bookName, query)),
    [bookNames, query]
  );

  // Virtualization render function
  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <li style={style} key={index}>
        {filteredBookNames[index]}
      </li>
    ),
    [filteredBookNames]
  );

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      className='w-full'
      options={filteredBookNames}
      groupBy={(option) => option[0]}
      value={query}
      onInputChange={(e, newInputValue) => { handleInputChange(e, newInputValue) }}
      ListboxComponent={(props) => (
        <FixedSizeList
          height={250}
          width="100%"
          itemSize={46}
          itemCount={filteredBookNames.length}
          {...props}
        >
          {renderRow}
        </FixedSizeList>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Vyhldat knihu..."
          // className={classes.searchBox}
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