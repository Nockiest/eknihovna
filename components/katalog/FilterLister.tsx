'use client'
import { checkIfIgnoredValue } from "@/types/typeChecks";
import { Filters, FiltringValues } from "@/types/types";
import { translateBookKey } from "@/utils/translateBookKeys";
import CategoryChip from "./CategoryChip";
import { Box, Typography } from "@mui/material";
import fetchUniqueValues from "@/utils/apiConections/fetchUniqueValues";
import { useSearchContext } from "@/app/katalog/context";
import { useEffect } from "react";

type FilterListerProps = {
};

const FilterLister: React.FC<FilterListerProps> =   ({

}) => {
  const { activeFilters, setFilters, setFiltersValues, setErrorMessage } = useSearchContext();

  const filterKeys = Object.keys(activeFilters) as (keyof Filters)[];
  async function fetchUniqueFilterCol(
    colName: "genres" | "category" | "author"|'name'
  ) {

    const res = await fetchUniqueValues(colName);
    console.log('fetch unique vals:',colName, res)
    setFiltersValues((prevFilters: FiltringValues) => ({
      ...prevFilters,
      [colName]: res,
    }));
  }

// maybe ineffective?
  useEffect(() => {
    console.log('fetching activeFilters')
    async function update() {
      try {
        await Promise.all([
          fetchUniqueFilterCol("genres"),
          fetchUniqueFilterCol("category"),
          fetchUniqueFilterCol("author"),
          fetchUniqueFilterCol("name"),
        ]);
      } catch (error) {
        setErrorMessage("Failed to load books.");
      }
    }
    update();
  }, []);

  const removeFilter = (key: keyof Filters, value: string | boolean) => {
    setFilters((prevFilters: Filters) => {
      const currentFilter = prevFilters[key];
      console.log(key, value, prevFilters[key]);

      if (Array.isArray(currentFilter)) {
        // Remove the specified value from the array
        const updatedArray = currentFilter.filter(
          (item: string) => item !== value
        );
        console.log(updatedArray);
        return {
          ...prevFilters,
          [key]: updatedArray,
        };
      } else {
        // Set the value under the key to null
        return {
          ...prevFilters,
          [key]: null,
        };
      }
    });
  };
  return (
    <Box className="m-2">
      {filterKeys.map((key) => {
        if (key === "name"){
          return
        }
        const value = activeFilters[key];

        if (checkIfIgnoredValue(value)) {
          return null;
        }
        return (
          <div key={key}>
            <Typography variant="subtitle1">{translateBookKey(key)}</Typography>
            {typeof value === "string" || typeof value === "boolean" ? (
              <CategoryChip
                key={key}
                text={
                  typeof value === "boolean" ? translateBookKey(key) : value
                }
                onRemove={() => removeFilter(key, value)}
              />
            ) : (
              Array.isArray(value) &&
              value.map((item, index) => (
                <CategoryChip
                  key={`${key}-${index}`}
                  text={item}
                  onRemove={() => removeFilter(key, item)}
                />
              ))
            )}
          </div>
        );
      })}
    </Box>
  );
};

export default FilterLister;
