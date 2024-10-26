// function getRandomDelay(): number {
//     // Generuje náhodné zpoždění mezi 500 ms a 3000 ms
//     return Math.floor(Math.random() * (3000 - 500)) + 500;
//   }

//   async function delay(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

async function getBookCoverURL(isbn: string): Promise<string> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 429) {
      // Pokud dostaneš chybu 429, bude čekat a zkusí to znovu
      console.warn("Příliš mnoho požadavků. Čekání a nový pokus...");
    } else {
      throw new Error("Chyba při komunikaci s API.");
    }
  }

  const data = await response.json();


  // Kontrola, zda jsou dostupné nějaké výsledky
  console.log(isbn)
   
  if (data.items && data.items.length > 0) {
    const bookInfo = data.items[0].volumeInfo;
    console.log(data.items[0]?.volumeInfo?.bookInfo?.imageLinks?.thumbnail)
    // Pokud jsou k dispozici odkazy na obrázky, vrátí URL obálky
    if (bookInfo.imageLinks && bookInfo.imageLinks.thumbnail) {
      return bookInfo.imageLinks.thumbnail; // URL obrázku obálky
    } else {
      return "";
      // throw new Error("Obrázek není k dispozici.");
    }
  } else {
    return "";
    // throw new Error("Kniha nebyla nalezena.");
  }
}

export default getBookCoverURL;
