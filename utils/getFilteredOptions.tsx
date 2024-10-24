import { Filters, FiltringValues } from "@/types/types";

 const getFilteredOptions = (key: keyof FiltringValues,filterValues:FiltringValues, activeFilters:Filters) => {
    return filterValues[key]?.filter(
      (option) => !activeFilters[key]?.includes(option)
    ); 
  };
  export default getFilteredOptions