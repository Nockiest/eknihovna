export const checkSearchRelevant = (keyword: string, query: string) => {
    if (query.replace(/\s/g, '') === '') {
      return false;
    }
    const keywordWithoutSpaces = keyword.replace(/\s+/g, ' ').trim();
    const queryWithoutSpaces = query.replace(/\s+/g, ' ').trim();
    return (
      keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces.toLocaleLowerCase()) >= 0 ||
      queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()) >= 0
    );
  };

export   const checkResultIncludesQuery = (result: string, query: string): boolean => {
    return result.replace(/\s+/g, ' ').trim().toLocaleLowerCase().includes(query.replace(/\s+/g, ' ').trim().toLocaleLowerCase())  ;
  };

 export  function getSimilarity(result: string, query: string) {
    result = result.toLowerCase();
    query = query.toLowerCase();
    return result.length - result.replace(new RegExp(query, 'g'), '').length;
  }

  //sanitizedResults.filter((result:Book) => {
    //   return (
    //     // checkSearchRelevant(result.keyword, query as string) ||
    //     checkResultStartWithQuery(result.name, bookName as string)
    //   );
    // });
    // console.log(filteredResults);
    // filteredResults.sort((a, b) => {
    //   return (
    //     getSimilarity(b.keyword, bookName as string) -
    //     getSimilarity(a.keyword, bookName as string)
    //   );
    // });
export default function getRelevancy(value: string, query: string) {
    return (
        checkResultIncludesQuery(value, query)||
        getSimilarity(query , query ) < 3
    )

}