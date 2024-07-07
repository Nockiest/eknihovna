import { useSearchContext } from "@/app/katalog/context";
import { Fab } from "@mui/material";
import Image from "next/image";
import React from "react";
type SearcherOpenerFabProps = {
  onClick: () => void;
  css?: string;
};

const SearcherOpenerFab: React.FC<SearcherOpenerFabProps> = ({
  onClick,
  css,
}) => {
  return (
    <Fab
      size="large"
      onClick={onClick}
      className={`z-1 ${css}  flex-0 flex justify-center items-center  `}
    >
      <Image
        src="/icon/filter.svg"
        alt="search"
        width={32}
        height={32}
        className="m-1"
      />
    </Fab>
  );
};

export default SearcherOpenerFab;
