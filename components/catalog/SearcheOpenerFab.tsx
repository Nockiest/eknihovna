import { useSearchContext } from '@/app/katalog/context';
import { Fab } from '@mui/material';
import Image from 'next/image';
import React from 'react'
type SearcherOpenerFabProps = {
    onClick: () => void;
  };

  const SearcherOpenerFab: React.FC<SearcherOpenerFabProps> = ({onClick}) => {

  return (
    <Fab
          size="large"
          onClick={() => {
            onClick()
          }}
          className='z-1'
        >
          <Image
            src="icon/filter.svg"
            alt="search"
            width={32}
            height={32}
            className="m-1"
          />
        </Fab>
  )
}

export default SearcherOpenerFab