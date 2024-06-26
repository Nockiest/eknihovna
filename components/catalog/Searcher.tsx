"use client"
import React, { useState } from "react";
import {
  Slide,
  Paper,
  useTheme,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Fab,
  TextField,
} from "@mui/material";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import Image from "next/image";
import theme from "@/theme/theme";
import { Filters } from "@/types/types";
import { useSearchContext } from "@/app/katalog/context";

interface SearcherProps {
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Searcher: React.FC<SearcherProps> = ( ) => {
  const classes = useTheme();
    const {isOpenSearcher,setOpenSearcher,filters,setFilters,books,setBooks} = useSearchContext()
    const handleFilterChange = (key: keyof Filters, value: Filters[keyof Filters]) => {
        setFilters((prevFilters:Filters) => ({
          ...prevFilters,
          [key]: value,
        }));
      };
      return (
        <Slide direction="up" in={isOpenSearcher} mountOnEnter unmountOnExit>
          <Paper
            elevation={3}
            style={{
              position: "fixed",
              bottom: 0,
              left: "16px",
              right: "16px",
              zIndex: 999,
              padding: "16px",
              height: "75vh",
            }}
          >
            <button
              onClick={() => {
                setOpenSearcher(!isOpenSearcher);
              }}
            >
              <Fab>
                <Image
                  src={"icon/cross.svg"}
                  alt="cross"
                  width={"32"}
                  height={32}
                />
              </Fab>
            </button>

            <SearchBar />

            <TextField
              label="Název"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Žánr"
              value={filters.genres}
              onChange={(e) => handleFilterChange('genres', e.target.value)}
              fullWidth
              margin="normal"
            />

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.available}
                    onChange={(e) => handleFilterChange('available', e.target.checked)}
                  />
                }
                label="Dostupnost"
                sx={{
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.secondary.main,
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.forMaturita}
                    onChange={(e) => handleFilterChange('forMaturita', e.target.checked)}
                  />
                }
                label="Maturitní"
                sx={{
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            </FormGroup>
          </Paper>
        </Slide>
      );
};

export default Searcher;

// const SearchFilters = () => {

//     const [results, setResults] = useState([]);

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = event.target;
//       setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
//     };

//     const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, checked } = event.target;
//       setFilters((prevFilters) => ({ ...prevFilters, [name]: checked }));
//     };

//     useEffect(() => {
//       const fetchData = async () => {
//         const response = await fetch('/api/search', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(filters),
//         });
//         const result = await response.json();
//         setResults(result);
//       };

//       fetchData();
//     }, [filters]);

//     return (
//       <div>
//         <TextField
//           label="Keyword"
//           name="keyword"
//           value={filters.keyword}
//           onChange={handleInputChange}
//         />
//         <Select
//           name="category"
//           value={filters.category}
//           onChange={handleInputChange}
//         >
//           <MenuItem value="">
//             <em>None</em>
//           </MenuItem>
//           <MenuItem value="category1">Category 1</MenuItem>
//           <MenuItem value="category2">Category 2</MenuItem>
//         </Select>
//         <Checkbox
//           name="isActive"
//           checked={filters.isActive}
//           onChange={handleCheckboxChange}
//         />
//         <Button onClick={() => setFilters({ keyword: '', category: '', dateRange: [null, null], isActive: false })}>
//           Clear Filters
//         </Button>
//         <div>
//           {results.map((result, index) => (
//             <div key={index}>{JSON.stringify(result)}</div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   export default SearchFilters;