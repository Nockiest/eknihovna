export type StringedBool = "true" | "false";

export  type Filters= {
    name: string|null ;
    author: string[];
    category: string[];
    genres: string[];
    formaturita: StringedBool|null;
    available: StringedBool|null;
  };

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