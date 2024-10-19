import { Book, Filters, FiltringValues } from "@/types/types";
import { useContext, createContext } from "react";

type QueryContextType = {
  isOpenSearcher: boolean;
  setOpenSearcher: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilters: Filters;
  setActiveFilters: React.Dispatch<React.SetStateAction<Filters>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  // setBookNames: React.Dispatch<React.SetStateAction<string[]>>;
  filterValues: FiltringValues;
  setActiveFiltersValues: React.Dispatch<React.SetStateAction<FiltringValues>>;
  // bookNames: string[];
};

// Create the context
export const SearchContext = createContext<QueryContextType | undefined>(
  undefined
);

// Custom hook to use the SearchContext
export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }

  return context;
};
