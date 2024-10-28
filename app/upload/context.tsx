import { Book, Filters, FiltringValues } from "@/types/types";
import { useContext, createContext } from "react";

type UploadContextType = {

  // setActiveFilters:  React.Dispatch<React.SetStateAction<FiltringValues>>
  // activeFilters: FiltringValues
  books: Book[]
//   filterValues: FiltringValues
};

// Create the context
export const UploadContext = createContext<UploadContextType | undefined>(
  undefined
);

// Custom hook to use the SearchContext
export const useUploadContext = () => {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error(
      "useUploadContext must be used within a useUploadContextProvider"
    );
  }

  return context;
};
