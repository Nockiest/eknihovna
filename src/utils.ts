export function flattenIfArrayOfArrays(value: any): any {
    // Check if the value is an array and all its elements are arrays
    if (Array.isArray(value) && value.every(Array.isArray)) {
      // Flatten the array of arrays
      return value.flat();
    }
    // If value is not an array of arrays, return it as is
    return value;
  }