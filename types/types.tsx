export type Book = {
    id: string
    name?: string
    author?: string
    category: string
    genres?:string[]
    rating?: number
    available?: boolean
    formaturita?: boolean
    bookCoverURL?: string
    zpusob_ziskani?: string
    signatura?:string
}

export type NavButton = {
    URL: string;
    label: string;
  }

export type StringedBool = "true" | "false";

export  type Filters= {
  name: string|null ;
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
    name: string[] ;
  };

export type UploadJsonData = {
  headers: string[];
  rows: any[];
}