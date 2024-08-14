// File: /lib/buildPrismaFilter.ts

import { Filters } from "@/types/types";

export function buildPrismaFilter(filters: Filters) {
    // Construct the Prisma 'where' clause based on your filters
    debugger
      const where: any = {}; // Use a more specific type if available
      if (filters?.author && filters?.author?.length > 0) {

        where.author = {
          contains: filters.author  || undefined,
          mode: 'insensitive',
        };
      }

      if (filters.category  && filters?.category?.length > 0){
        where.category = {
          contains: filters.category  || undefined,
          mode: 'insensitive',
        };
      }

      if (filters.genres  && filters?.genres?.length > 0) {
        where.genres = {
          hasSome: filters.genres.length > 0 ? filters.genres : undefined,
        };
      }

    // Add other filters as necessary
    // Example for boolean fields:
    if (filters.available !== undefined) {
      where.available = filters.available;
    }

    // Example for integer fields:
    // if (filters.rating) {
    //   where.rating = filters.rating;
    // }

    return where;
  }
