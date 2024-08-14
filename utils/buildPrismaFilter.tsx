// File: /lib/buildPrismaFilter.ts

export function buildPrismaFilter(filters: any) {
    // Construct the Prisma 'where' clause based on your filters
    const where: any = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.author) {
      where.author = {
        contains: filters.author,
        mode: 'insensitive',
      };
    }

    if (filters.category) {
      where.category = {
        contains: filters.category,
        mode: 'insensitive',
      };
    }

    // Add other filters as necessary
    // Example for boolean fields:
    if (filters.available !== undefined) {
      where.available = filters.available;
    }

    // Example for integer fields:
    if (filters.rating) {
      where.rating = filters.rating;
    }

    return where;
  }
