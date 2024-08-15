import { Breakpoint } from "@mui/material";

export const truthyValues = [true,'true', "ano", "yes", 1, "dostupný"];
export const falsyValues = [false,'false', "ne", "no", 0, "nedostupný"];
// export const knihyURL =
//   process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3002"; // Adjust URL as per your backend setup

  export const defaultFilters = {
    author: [],
    category: [],
    genres: [],
    formaturita : null,
    available: null
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
        book_code: 123456,      // Replace with the actual book code
        name: 'Book Name',      // Replace with the actual book name
        author: 'Author Name',  // Replace with the actual author name
        category: 'Category',   // Replace with the actual category
        genres: ['Genre1', 'Genre2'], // Replace with the actual genres
        umisteni: 'Location',   // Replace with the actual location
        signatura: 'Signature', // Replace with the actual signature
        zpusob_ziskani: 'Method of Acquisition', // Replace with the actual acquisition method
        formaturita: true,      // Replace with true or false depending on whether it's formal
        available: true,        // Replace with true or false depending on availability
        rating: 5               // Replace with the actual rating
      } 