
import { falsyValues } from "@/data/values";
import { Filters } from "@/types/types";

export function buildPrismaFilter(filters: Filters) {
  const where: any = {}; // Use a more specific type if available

  // Handle the 'author' filter
  if (filters?.author && filters?.author.length > 0) {
    if (Array.isArray(filters.author)) {
      // If 'author' is an array, create an OR condition
      where.OR = filters.author.map((author) => ({
        author: {
          contains: author,
          mode: 'insensitive',
        },
      }));
    } else {
      // If 'author' is a single string
      where.author = {
        contains: filters.author,
        mode: 'insensitive',
      };
    }
  }

  // Handle the 'category' filter
  if (filters?.category && filters?.category.length > 0) {
    if (Array.isArray(filters.category)) {
      // If 'category' is an array, create an OR condition
      where.OR = [
        ...(where.OR || []),
        ...filters.category.map((category) => ({
          category: {
            contains: category,
            mode: 'insensitive',
          },
        })),
      ];
    } else {
      // If 'category' is a single string
      where.category = {
        contains: filters.category,
        mode: 'insensitive',
      };
    }
  }

  // Handle the 'genres' filter
  if (filters?.genres && filters.genres.length > 0) {
    where.genres = {
      hasSome: filters.genres,
    };
  }

  // // Handle the 'available' filter
  if ( falsyValues.indexOf( filters.available ) <  0) {
    where.available = filters.available;
  }

  if ( falsyValues.indexOf( filters.formaturita )< 0) {
    where.formaturita = filters.formaturita;
  }
  // Return the constructed 'where' clause
  return where;
}
 