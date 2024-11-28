import { Book } from "@/types/types"

export function translateBookKey(bookKey: keyof Book|"new" ): string {
    const translationDict: Record<keyof Book | "new", string> = {
        id: 'id',
        name: 'název',
        author: 'autor',
        category: 'kategorie',
        genres: 'žánry',
        rating: 'hodnocení',
        available: 'dostupná',
        formaturita: 'maturitní',
        zpusob_ziskani: 'zpusob_ziskani',
        signatura: 'signatura',
        isbn: 'isbn',
        createdat: 'datum vytvoření',
        updatedat: 'datum aktualizace',
        new: "nová"
    };
    return translationDict[bookKey]
}
