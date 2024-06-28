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

  export interface Filters {
    name: string;
    genres: string[]|null;
    available: boolean;
    forMaturita: boolean;
  }
