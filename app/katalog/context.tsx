import { Book, Filters  } from "@/types/types";
import { useContext,createContext } from "react";


type QueryContextType = {
  isOpenSearcher: boolean;
  setOpenSearcher: React.Dispatch<React.SetStateAction<boolean>>;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[] >>;
  genres: string[] | Promise<string[]>
  categories:string[] | Promise<string[]>
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