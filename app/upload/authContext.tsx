import { Book, Filters, FiltringValues  } from "@/types/types";
import { useContext,createContext } from "react";



type AuthContextType = {
  isAuth: boolean
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
};

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Custom hook to use the SearchContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useSearchContext must be used within a SearchContextProvider"
    );
  }

  return context;
};
