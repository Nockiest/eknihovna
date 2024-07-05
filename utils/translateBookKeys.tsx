import { Book } from "@/types/types"

export function translateBookKey(bookKey: keyof Book ): string {
    const translationDict: Record<keyof Book, string> = {
        id: 'identifikátor',
        book_code: 'kód_knihy',
        name: 'název',
        author: 'autor',
        description: 'popis',
        category: 'kategorie',
        genres: 'žánry',
        rating: 'hodnocení',
        available: 'dostupná',
        formaturita: 'maturitní',
        bookCoverURL: 'URL_obálky'
    };

    const translatedBook: Partial<Book> = {};


    return translationDict[bookKey]
}
