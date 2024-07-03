export type Book = {
    id: string
    book_code: number
    name: string
    author: string
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



  export  type Filters= {
    [key: string]: string|null ;
  };

  export type FiltringValues = {
    category: string[];
    genres: string[];
    author: string[];
    name: string[];
  };