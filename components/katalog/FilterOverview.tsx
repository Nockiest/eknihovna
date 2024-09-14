import { useSearchContext } from "@/app/katalog/context";
import { PrimaryButton } from "@/theme/buttons/Buttons";
import { Box } from "@mui/material";
import React from "react";
import CategoryChip from "./CategoryChip";
import SearcherOpenerFab from "./SearcheOpenerFab";
import { isStringedBool } from "@/types/typeChecks";
import { Filters } from "@/types/types";



interface FilterOverviewProps {
  removeFilter: (key: keyof Filters, value: any) => void;
}

const FilterOverview: React.FC<FilterOverviewProps> = ({ removeFilter }) => {
  const { activeFilters, isOpenSearcher, setOpenSearcher } = useSearchContext();
  const filterKeys = Object.keys(activeFilters) as (keyof Filters)[];

  return (
    <Box className="w-full flex flex-wrap">
      <SearcherOpenerFab
  css={  isOpenSearcher ? "hidden" : "block"  }
  onClick={() => setOpenSearcher(true)}
/>

      {filterKeys.map((key) => {
        const value = activeFilters[key];
        if (value) {
          if (typeof value === 'string') {
            return (
              <CategoryChip
                key={key}
                text={isStringedBool(value) ? key : value}
                onRemove={() => removeFilter(key, value)}
              />
            );
          } else if (Array.isArray(value)) {
            return value.map((item, index) => (
              <CategoryChip
                key={`${key}-${index}`}
                text={item}
                onRemove={() => removeFilter(key, item)}
              />
            ));
          }
        }
        return null;
      })}
    </Box>
  );
};

export default FilterOverview;
