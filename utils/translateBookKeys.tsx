import { Book } from "@/types/types"

export function translateBookKey(bookKey: keyof Book ): string {
    const translationDict: Record<keyof Book, string> = {
        id: 'id',
        name: 'název',
        author: 'autor',
        category: 'kategorie',
        genres: 'žánry',
        rating: 'hodnocení',
        available: 'dostupná',
        formaturita: 'maturitní',
        bookCoverURL: 'URL_obálky',
        zpusob_ziskani: 'zpusob_ziskani',
        signatura: 'signatura',
        isbn: 'isbn',
    };
    return translationDict[bookKey]
}
