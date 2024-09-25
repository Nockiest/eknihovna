import { Breakpoint } from "@mui/material";
import { NavButton } from "@/types/types";

export const truthyValues = [true,'true', "ano", "yes", 1, "dostupný"];
export const falsyValues = [false,'false', "ne", "no", 0, "nedostupný",undefined, null];
// export const knihyURL =
//   process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3002/api"; // Adjust URL as per your backend setup

  export const defaultFilters = {
    author: [],
    category: [],
    genres: [],
    formaturita : null,
    available: null,
    name: null,
  }

// CORS headers configuration
export const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const noCacheHeaders = {
  "Cache-Control":
  "no-store, no-cache, must-revalidate, proxy-revalidate",
Pragma: "no-cache",
Expires: "0",
"Surrogate-Control": "no-store",
}
export  const shownBooksBySize: Record<Breakpoint, number> = {
    xs: 12,
    sm: 12,
    md: 24,
    lg: 36,
    xl: 36,
  };

  export const testBook = {
        id: 'x',  // Replace with your actual unique ID or a UUID generator
        name: 'Book Name',      // Replace with the actual book name
        author: 'Author Name',  // Replace with the actual author name
        category: 'Category',   // Replace with the actual category
        genres: ['Genre1', 'Genre2'], // Replace with the actual genres
        umisteni: 'Location',   // Replace with the actual location
        signatura: 'Signature', // Replace with the actual signature
        formaturita: true,      // Replace with true or false depending on whether it's formal
        available: true,        // Replace with true or false depending on availability
        rating: 5               // Replace with the actual rating
      }


export const navRoutes: NavButton[] = [
    { URL: "/", label: "Úvod" },
    // { URL: "/about", label: "O Knihovně" },
    { URL: "/katalog", label: "Katalog" },
    { URL: "/news", label: "Zprávy" },
    { URL: "/contact", label: "Kontakt" },
    { URL: "/upload", label: "API" },
  ]

export const  bookHeaders = [
    "id",
    "name",
    "author",
    "category",
    "genres",
    "umisteni",
    "signatura",
    "formaturita",
    "available",
    "rating",
  ]