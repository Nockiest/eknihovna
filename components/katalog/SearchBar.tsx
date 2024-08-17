import React, { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import debounce from "lodash";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { FixedSizeList } from "react-window";
import { useSearchContext } from "@/app/katalog/context";
import fetchUniqueValues from "@/utils/apiConections/fetchUniqueValues";

interface SearchAutocompleteProps {}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = () => {
  const { bookNames, setQuery, setBookNames, setErrorMessage } = useSearchContext();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    async function update() {
      try {
        const bookNames = await fetchUniqueValues("name");
        setBookNames(bookNames);
      } catch (error) {
        setErrorMessage("Failed to load book names.");
      }
    }
    update();
  }, [setBookNames, setErrorMessage]);

  const renderRow = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <li
        style={style}
        key={index}
        onClick={() => {
          const selectedValue = bookNames[index];
          setQuery(selectedValue);
        }}
      >
        {bookNames[index]}
      </li>
    ),
    [bookNames, setQuery]
  );

  const changeQuery = (newPage: string) => {
    const currentQuery = new URLSearchParams(searchParams.toString());
    currentQuery.set("query", newPage);
    router.push(`${pathName}?${currentQuery.toString()}`);
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      className="w-full"
      options={bookNames}
      groupBy={(option) => option[0]}
      value={query}
      onInputChange={(e, newInputValue) => {
        changeQuery(newInputValue);
      }}
 
      onChange={(e, newValue) => {
        if (newValue) {
          setQuery(newValue);
          changeQuery(newValue);
        }
      }}
      ListboxComponent={(props) => (
       // @ts-ignore
        <FixedSizeList
          height={250}
          width="100%"
          className="cursor-pointer"
          itemSize={46}
          itemCount={bookNames.length}
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
