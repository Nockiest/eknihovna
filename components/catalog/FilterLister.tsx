import { checkIfIgnoredValue } from '@/types/typeChecks'
import { Filters } from '@/types/types'
import { translateBookKey } from '@/utils/translateBookKeys'
import CategoryChip from './CategoryChip'
import { Box, Typography } from '@mui/material'

type FilterListerProps = {
    filters: Filters;
    removeFilter: (key: keyof Filters, value: string | boolean) => void;
}

const FilterLister: React.FC<FilterListerProps> = ({ filters, removeFilter }) => {
  const filterKeys = Object.keys(filters) as (keyof Filters)[];

  return (
    <Box className='m-2'>
      {filterKeys.map((key) => {
        const value = filters[key];
        if (checkIfIgnoredValue(value)) {
          return null;
        }
        return (
          <div key={key}>
            <Typography variant="subtitle1">{translateBookKey(key)}</Typography>
            {typeof value === "string" || typeof value === 'boolean' ? (
              <CategoryChip
                key={key}
                text={typeof value === 'boolean' ? translateBookKey(key) : value}
                onRemove={() => removeFilter(key, value)} />
            ) : (
              Array.isArray(value) && value.map((item, index) => (
                <CategoryChip
                  key={`${key}-${index}`}
                  text={item}
                  onRemove={() => removeFilter(key, item)} />
              ))
            )}
          </div>
        );
      })}
    </Box>
  )
}

export default FilterLister
