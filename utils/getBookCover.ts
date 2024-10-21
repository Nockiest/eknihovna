async function getBookCoverURL(isbn: string): Promise<string> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Chyba při komunikaci s API.");
        }

        const data = await response.json();

        // Kontrola, zda jsou dostupné nějaké výsledky
        if (data.items && data.items.length > 0) {
            const bookInfo = data.items[0].volumeInfo;

            // Pokud jsou k dispozici odkazy na obrázky, vrátí URL obálky
            if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail) {
                return bookInfo.imageLinks.thumbnail; // URL obrázku obálky
            } else {
                throw new Error("Obrázek není k dispozici.");
            }
        } else {
            throw new Error("Kniha nebyla nalezena.");
        }
    } catch (error) {
        throw new Error(`Chyba: ${(error as Error).message}`);
    }
}

export default getBookCoverURL;
// Příklad použití
