import { Filters } from "./types";

export function flattenIfArrayOfArrays(value: any): any {
  // Check if the value is an array and all its elements are arrays
  if (Array.isArray(value) && value.every(Array.isArray)) {
    // Flatten the array of arrays
    return value.flat();
  }
  // If value is not an array of arrays, return it as is
  return value;
}

export const isFiltersType = (value: any): value is Filters => {
  const hasCorrectKeys = (value: any): boolean => {
    return (
      (typeof value.name === "undefined" || typeof value.name === "string") &&
      (typeof value.author === "undefined" || typeof value.author === "string" || Array.isArray(value.author)) &&
      (typeof value.category === "undefined" || typeof value.category === "string" || Array.isArray(value.category)) &&
      (typeof value.genre === "undefined" || Array.isArray(value.genre)) &&
      (typeof value.formaturita === "undefined" || typeof value.formaturita === "boolean") &&
      (typeof value.available === "undefined" || typeof value.available === "boolean")
    );
  };
  return (
    value !== null &&
    !Array.isArray(value) &&
    typeof value === "object" &&
    hasCorrectKeys(value)
  );
};
