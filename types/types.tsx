export type Book = {
    id: string
    name: string
    author: string
    description?: string
    genre?:string
    rating?: number
    iban?: number
    available: boolean
    formaturita: boolean
    bookCoverURL?: string

}

export type NavButton = {
    URL: string;
    label: string;
  }