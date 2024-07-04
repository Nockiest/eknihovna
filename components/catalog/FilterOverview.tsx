import { useSearchContext } from "@/app/katalog/context";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { getBooksByQuery } from "@/utils/fetchBooks";
import { Box } from "@mui/material";
import React from "react";
import CategoryChip from "./CategoryChip";
import SearcherOpenerFab from "./SearcheOpenerFab";
import { isStringedBool } from "@/types/typeChecks";

interface FilterOverviewProps {
  removeFilter: (key: string, value:any) => void;
}
const FilterOverview: React.FC<FilterOverviewProps> = ({ removeFilter }) => {
  const { filters, isOpenSearcher, setOpenSearcher } = useSearchContext();

  const filterKeys = Object.keys(filters);

  return (
    <Box className="w-full flex flex-col items-start my-4">
      <SearcherOpenerFab
        css={`flex-0 ${isOpenSearcher ? "hidden" : "block"}`}
        onClick={() => {
          setOpenSearcher(!isOpenSearcher);
        }}
      />

      <Box className="w-full flex flex-wrap">
        {filterKeys.map((key) => {
          const value = filters[key];
          if (value) {
            if (typeof value === 'string') {
              return (
                <CategoryChip
                  key={key}
                  text={isStringedBool(value) ? key : value}
                  onRemove={() => removeFilter(key,value)}
                />
              );
            } else if (Array.isArray(value)) {
              return value.map((item, index) => (
                <CategoryChip
                  key={`${key}-${index}`}
                  text={item}
                  onRemove={() => removeFilter(key,item)}
                />
              ));
            }
          }
          return null;
        })}
      </Box>
    </Box>
  );
};

export default FilterOverview;
