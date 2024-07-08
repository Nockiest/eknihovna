export type Book = {
    id: string
    book_code: number
    name?: string
    author?: string
    description?: string
    category: string
    genres?:string[]
    rating?: number
    available: boolean
    formaturita: boolean
    bookCoverURL?: string
}

export type NavButton = {
    URL: string;
    label: string;
  }

export type StringedBool = "true" | "false";

export  type Filters= {
  // [key: string]: string[]| Omit<string | 'false' | 'true', 'false' | 'true'>| StringedBool|null ;
  // name: string|null ;
  author?: string[];
  category?: string[];
  genres?: string[];
  formaturita?: boolean|null;
  // rating: number;
  available?: boolean|null;
};

  export type FiltringValues = {
    category: string[];
    genres: string[];
    author: string[];
    // name: string[];
  };