export type Book = {
    id: string
    book_code: number
    name: string
    author: string
    description?: string
    category: string
    genre?:string
    rating?: number
    available: boolean
    formaturita: boolean
    bookCoverURL?: string
}

export type NavButton = {
    URL: string;
    label: string;
  }
