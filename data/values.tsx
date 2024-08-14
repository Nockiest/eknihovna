import { Breakpoint } from "@mui/material";
import { PrismaClient } from "@prisma/client";

export const truthyValues = [true,'true', "ano", "yes", 1, "dostupný"];
export const falsyValues = [false,'false', "ne", "no", 0, "nedostupný"];
export const knihyURL =
  process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3002"; // Adjust URL as per your backend setup

  export const defaultFilters = {
    author: [],
    category: [],
    genres: [],
    formaturita : null,
    available: null
  }

  export  const prisma = new PrismaClient();

export  const shownBooksBySize: Record<Breakpoint, number> = {
    xs: 12,
    sm: 12,
    md: 24,
    lg: 36,
    xl: 36,
  };