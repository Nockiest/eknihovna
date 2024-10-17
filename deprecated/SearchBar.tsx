import React, { useCallback, useMemo } from "react";
import { Autocomplete, TextField,   Box, useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSearchContext } from "@/app/katalog/context";
import theme from "@/theme/theme";

const SearchAutocomplete: React.FC = () => {
  const { filterValues, activeFilters, setFilters } = useSearchContext();
  const router = useRouter();
  // const pathName = usePathname();
  const searchParams = useSearchParams();
  const filteredOptions = useMemo(() => {
    const searchTerm = activeFilters.name?.toLowerCase() || "";
    const results = filterValues.name.filter((option) => {
      return option.toLowerCase().includes(searchTerm);
    });
    // console.log("Filtered options:", results); // Debugging: Check filtered options
    return results;
  }, [filterValues.name, activeFilters.name]);

  const changeParams = useCallback(
    (newname: string) => {
      console.log("Query changed:", newname); // Debugging: Check the new query value
      setFilters((prevFilters) => ({
        ...prevFilters,
        name: newname.trim(),
      }));
      // const currentQuery = new URLSearchParams(searchParams.toString());
      // currentQuery.set("page", "1");
      // router.push(`${pathName}?${currentQuery.toString()}`);
    },
    [setFilters, searchParams,  router]
  );
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Autocomplete
      id="book-searcher"
      sx={{
        color: prefersDarkMode ? "#ffffff" : "#000000",
        backgroundColor: !prefersDarkMode ? "#ffffff" : "#000000",
        borderRadius: "1em",
        cursor: "pointer",
      }}
      options={filteredOptions}
      className="w-full"
      autoHighlight
      value={activeFilters.name}
      getOptionLabel={(option) => option}
      onChange={(e, newValue) => {
        console.log("Autocomplete value changed:", newValue);
        if (newValue) {
          changeParams(newValue);
        }
      }}
      onInputChange={(e, newInputValue) => {
        console.log("Input changed:", newInputValue);
        changeParams(newInputValue);
      }}
      renderOption={(props, bookName) => {
        return (
          <Box
            key={bookName}
            component="li"
            sx={{
              color: "#ffffff",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("Row clicked, selected value:", bookName);
              changeParams(String(bookName));
            }}
          >
            {bookName}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Vyhledejte knihu"
          InputProps={{
            ...params.InputProps,
            sx: {
              color: prefersDarkMode ? "#ffffff" : "#000000", // Text color
              "& .MuiInputBase-input": {
                color: prefersDarkMode ? "#ffffff" : "#000000", // Input text color
              },
              "& .MuiInputLabel-root": {
                color: prefersDarkMode ? "#aaaaaa" : "#000000", // Placeholder color
              },
              backgroundColor: !prefersDarkMode ? "#ffffff" : "#000000", // Background color
              cursor: "pointer",

            },
          }}
          InputLabelProps={{
            sx: {
              color: prefersDarkMode ? "#aaaaaa" : "#000000", // Placeholder (label) color
              cursor: "pointer",
            },
          }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;

// const handleSelect = (selectedValue: string) => {
//   console.log("Selected value:", selectedValue); // Debugging: Check the selected value

//   // Update the 'name' key in the activeFilters object
//   setFilters((prevFilters) => ({
//     ...prevFilters,
//     name: selectedValue,
//   }));

//   // Update the query parameter in the URL
//   const currentQuery = new URLSearchParams(searchParams.toString());
//   currentQuery.set("query", selectedValue);
//   console.log("Updated query params:", currentQuery.toString()); // Debugging: Check the updated query params
//   router.push(`${pathName}?${currentQuery.toString()}`);
// };
// const debouncedOnInputChange = useMemo(
//   () =>
//     debounce((value: string) => {
//       router.push({
//         pathname: router.pathname,
//         query: { ...router.query, query: value },
//       });
//     } ), // Adjust the debounce delay as needed
//   [router]
// );

// const handleInputChange =
// useCallback(
//   (e: React.SyntheticEvent, newInputValue: string) => {
//     router.push({
//       pathname: router.pathname,
//       query: { ...router.query, query: newInputValue },
//     });
//     // debouncedOnInputChange(newInputValue); // Update the input value when typing
//   },
//   [debouncedOnInputChange]
// );
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

// const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
//   onInputChange,
// }) => {
//   // const classes = useStyles();
//   const { query, setQuery, bookNames } = useSearchContext();

//   // Debounce the input change handler to limit the number of calls
//   const debouncedOnInputChange = useMemo(
//     () =>
//       debounce((value: string) => {
//         onInputChange(value);
//       }, 300),
//     [onInputChange]
//   );
//   const handleInputChange = useCallback(
//     (e: React.SyntheticEvent, newInputValue: string) => {
//       setQuery(newInputValue);
//       debouncedOnInputChange(newInputValue); // Update the input value when typing
//     },
//     [debouncedOnInputChange]
//   );

//   const filteredBookNames = bookNames.filter((bookName) => getRelevancy(bookName, query))
//  Array.isArray(bookNames)
//   ? bookNames.filter((bookName) => getRelevancy(bookName, query))
//   : [];
// useMemo(() => {

// }, [bookNames, query]);

// Virtualization render function
//   const renderRow = useCallback(
//     ({ index, style }: { index: number; style: React.CSSProperties }) => (
//       <li style={style} key={index}>
//         {filteredBookNames[index]}
//       </li>
//     ),
//     [filteredBookNames]
//   );
//   const handleScroll = () => {};
//   return (
//     <Autocomplete
//       disablePortal
//       id="combo-box-demo"
//       className="w-full"
//       options={filteredBookNames}
//       groupBy={(option) => option[0]}
//       value={query}
//       onInputChange={(e, newInputValue) => {
//         handleInputChange(e, newInputValue);
//       }}
//       ListboxComponent={(props) => (
//         <FixedSizeList
//           height={250}
//           width="100%"
//           itemSize={46}
//           itemCount={filteredBookNames.length}
//           // @ts-ignore
//           onScroll={(props) => {
//             console.log(props);
//           }}
//           {...props}
//         >
//           {renderRow}
//         </FixedSizeList>
//       )}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           variant="outlined"
//           placeholder="Vyhldat knihu..."
//           // className={classes.searchBox}
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
// const renderRow = useCallback(
//   ({ index, style }: { index: number; style: React.CSSProperties }) => {
//     const selectedValue = filteredOptions[index];
//     return (
//       <div style={style} key={index}>
//         <li
//           className="cursor-pointer z-1 py-auto"
//           onClick={() => {
//             console.log("Row clicked, selected value:", selectedValue); // Debugging: Check click event
//             changeParams(selectedValue);
//           }}
//         >
//           {selectedValue}
//         </li>
//       </div>
//     );
//   },
//   [filteredOptions, changeParams]
// );
