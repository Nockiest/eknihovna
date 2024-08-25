import React, { useCallback,  } from "react";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FixedSizeList } from "react-window";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSearchContext } from "@/app/katalog/context";

const SearchAutocomplete: React.FC = () => {
  const { filterValues, filters, setFilters } = useSearchContext();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // Flag to prevent triggering `onInputChange` when an option is selected
  let inputChangedByUser = true;

  const handleSelect = (selectedValue: string) => {
    console.log("Selected value:", selectedValue); // Debugging: Check the selected value

    // Update the 'name' key in the filters object
    setFilters((prevFilters) => ({
      ...prevFilters,
      name: selectedValue,
    }));

    // Update the query parameter in the URL
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("query", selectedValue);
    console.log("Updated query params:", currentQuery.toString()); // Debugging: Check the updated query params
    router.push(`${pathName}?${currentQuery.toString()}`);
  };

  const changeQuery = (newPage: string) => {
    if (inputChangedByUser) {
      console.log("Query changed:", newPage); // Debugging: Check the new query value
      const currentQuery = new URLSearchParams(searchParams.toString());
      currentQuery.set("query", newPage);
      router.push(`${pathName}?${currentQuery.toString()}`);
    }
  };

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <li
        style={style}
        key={index}
        onClick={() => {
          const selectedValue = filterValues.name[index];
          console.log("Row clicked, selected value:", selectedValue); // Debugging: Check the selected value on row click
          handleSelect(selectedValue);
        }}
      >
        {filterValues.name[index]}
      </li>
    ),
    [filterValues.name]
  );

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      className="w-full"
      options={filterValues.name}
      groupBy={(option) => option[0]}
      value={filters.name}
      onInputChange={(e, newInputValue) => {
        inputChangedByUser = true;
        console.log("Input changed:", newInputValue); // Debugging: Check the input change value
        changeQuery(newInputValue);
      }}
      onChange={(event, newValue) => {
        inputChangedByUser = false;
        console.log("Autocomplete value changed:", newValue); // Debugging: Check the new value selected
        if (newValue) {
          handleSelect(newValue);
        }
      }}
      ListboxComponent={(props) => (
        // @ts-ignore
        <FixedSizeList
          height={250}
          width="100%"
          className="cursor-pointer"
          itemSize={46}
          itemCount={filterValues.name.length}
          {...props}
        >
          {renderRow}
        </FixedSizeList>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Vyhledat knihu..."
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
