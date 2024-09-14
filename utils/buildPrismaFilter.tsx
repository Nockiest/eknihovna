
import { falsyValues } from "@/data/values";
import { Filters } from "@/types/types";

export function buildPrismaFilter(activeFilters: Filters) {
  const where: any = {}; // Use a more specific type if available

  // Handle the 'author' filter
  if (activeFilters?.author && activeFilters?.author.length > 0) {
    if (Array.isArray(activeFilters.author)) {
      // If 'author' is an array, create an OR condition
      where.OR = activeFilters.author.map((author) => ({
        author: {
          contains: author,
          mode: 'insensitive',
        },
      }));
    } else {
      // If 'author' is a single string
      where.author = {
        contains: activeFilters.author,
        mode: 'insensitive',
      };
    }
  }
  // Handle the 'name' filter
  if (activeFilters.name) {
    where.OR = [
      {
        name: {
          startsWith: activeFilters.name,
          mode: 'insensitive', // Case-insensitive search
        },
      },
      {
        name: {
          contains: activeFilters.name,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    ];
  }

  // Handle the 'category' filter
  if (activeFilters.category && activeFilters.category.length > 0) {
    if (Array.isArray(activeFilters.category)) {
      // If 'category' is an array, create an OR condition
      where.OR = [
        ...(where.OR || []),
        ...activeFilters.category.map((category) => ({
          category: {
            contains: category,
            mode: 'insensitive',
          },
        })),
      ];
    } else {
      // If 'category' is a single string
      where.category = {
        contains: activeFilters.category,
        mode: 'insensitive',
      };
    }
  }

  // Handle the 'genres' filter
  if (activeFilters?.genres && activeFilters.genres.length > 0) {
    where.genres = {
      hasSome: activeFilters.genres,
    };
  }

  // // Handle the 'available' filter
  if ( falsyValues.indexOf( activeFilters.available ) <  0) {
    where.available = activeFilters.available;
  }

  if ( falsyValues.indexOf( activeFilters.formaturita )< 0) {
    where.formaturita = activeFilters.formaturita;
  }
  // Return the constructed 'where' clause
  return where;
}
