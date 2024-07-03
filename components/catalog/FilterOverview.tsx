import { useSearchContext } from '@/app/katalog/context';
import { PrimaryButton } from '@/theme/buttons/Buttons';
import { getBooksByQuery } from '@/utils/fetchBooks';
import { Box } from '@mui/material';
import React from 'react'
import CategoryChip from './CategoryChip';
interface FilterOverviewProps {
    removeFilter: (key: string) => void;
  }

  const FilterOverview: React.FC<FilterOverviewProps> = ({ removeFilter }) => {
    const {filters,setBooks} = useSearchContext();
  return (
    <Box className='w-full justify-between'>

        <Box className={'flex '}>
          {Object.entries(filters).map(([key, value], index) => (
            <CategoryChip
              key={index}
              text={
                value === "true" || value === "false" ? key : value.split(",").join(", ")
              }
              onRemove={() => removeFilter(key)}
            />
          ))}
        </Box>

          {Object.keys(filters).length > 0 && (
          <PrimaryButton
            onClick={async () => {
              const newBooks = await getBooksByQuery(filters);
              setBooks(newBooks);
            }}
          >
            Použít Filtry
          </PrimaryButton>
      )}
      </Box>
  )
}

export default FilterOverview