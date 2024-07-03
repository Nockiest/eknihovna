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
  const { filters, setBooks, isOpenSearcher, setOpenSearcher } =
    useSearchContext();
  return (
    <Box className="w-full flex flex-row items-center justify-between my-4">
      <SearcherOpenerFab
        css={`flex-0 ${isOpenSearcher? "hidden" : "block"}`}
        onClick={() => {
          setOpenSearcher(!isOpenSearcher);
        }}
      />
      <Box className={"  flex-1"}>
        {Object.entries(filters).map(([key, value], index) => (
          <CategoryChip
            key={index}
            text={
              value === "true" || value === "false"
                ? key
                : value.split(",").join(", ")
            }
            onRemove={() => removeFilter(key)}
          />
        ))}
      </Box>

      {Object.keys(filters).length > 0 && (
        <PrimaryButton
          className={"  flex-0"}
          onClick={async () => {
            const newBooks = await getBooksByQuery(filters);
            setBooks(newBooks);
          }}
        >
          Použít Filtry
        </PrimaryButton>
      )}
    </Box>
  );
};

export default FilterOverview;
