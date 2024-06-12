export type Book = {
    id: string
    name: string
    author?: string
    description?: string
    rating?: number
    iban?: number
    availability: boolean
    forMaturita: boolean
    bookCoverURL?: string
}