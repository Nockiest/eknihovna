
import { Book,  } from "@/types/types";
import { useContext, createContext } from "react";

type UploadContextType = {
  books: Book[]
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
};

// Create the context
export   const UploadContext = createContext<UploadContextType | undefined>(
  undefined
);

// Custom hook to use the SearchContext
export const useUploadContext = () => {
  const context = useContext(UploadContext);

  if (!context) {
    console.trace("No search context")
    throw new Error(
      "useUploadContext must be used within a useUploadContextProvider"
    );
  }

  return context;
};
