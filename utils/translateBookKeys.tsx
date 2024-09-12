import { Book } from "@/types/types"

export function translateBookKey(bookKey: keyof Book ): string {
    const translationDict: Record<keyof Book, string> = {
        id: 'id',
        book_code: 'kód_knihy',
        name: 'název',
        author: 'autor',
        description: 'popis',
        category: 'kategorie',
        genres: 'žánry',
        rating: 'hodnocení',
        available: 'dostupná',
        formaturita: 'maturitní',
        bookCoverURL: 'URL_obálky',
        zpusob_ziskani: 'zpusob_ziskani',
        signatura: 'signatura',
        umisteni: 'umisteni'
    };
    return translationDict[bookKey]
}
