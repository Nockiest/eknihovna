import { useSearchContext } from "@/app/katalog/context";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box } from "@mui/material";
import React from "react";
import CategoryChip from "./CategoryChip";
import SearcherOpenerFab from "./SearcheOpenerFab";
interface FilterOverviewProps {
  removeFilter: (key: string) => void;
}
const FilterOverview: React.FC<FilterOverviewProps> = ({ removeFilter }) => {
  const { filters, setBooks, isOpenSearcher, setOpenSearcher } = useSearchContext();

  const filterKeys = Object.keys(filters);
  const filtersPerRow = 3; // Number of filters to display per row

  return (
    <Box className="w-full flex flex-col items-start my-4">
      <SearcherOpenerFab
        css={`flex-0 ${isOpenSearcher ? "hidden" : "block"}`}
        onClick={() => {
          setOpenSearcher(!isOpenSearcher);
        }}
      />

      <Box className="w-full flex flex-wrap">
        {filterKeys.map((key, index) => {
          const value = filters[key];
          if (value) {
            return (
              <CategoryChip
                key={key}
                text={
                  value === "true" || value === "false"
                    ? key
                    : value.split(",").join(", ")
                }
                onRemove={() => removeFilter(key)}
              />
            );
          }
          return null;
        })}
      </Box>

      {/* {filterKeys.length > 0 && (
        <PrimaryButton
          className="w-1/2 mx-auto"
          onClick={async () => {
            const newBooks = await getBooksByQuery(filters);
            setBooks(newBooks);
          }}
        >
          Použít Filtry
        </PrimaryButton>
      )} */}
    </Box>
  );
};


export default FilterOverview;
