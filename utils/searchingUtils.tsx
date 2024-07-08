export const standardizeText = (text: string) => {
  return text.replace(/\s+/g, " ").trim().toLocaleLowerCase();
};

export const checkSearchRelevant = (keyword: string, query: string) => {
  if (query.replace(/\s/g, "") === "") {
    return false;
  }
  const keywordWithoutSpaces = standardizeText(keyword);
  const queryWithoutSpaces = standardizeText(query);
  return (
    keywordWithoutSpaces.indexOf(queryWithoutSpaces) >= 0 ||
    queryWithoutSpaces.indexOf(keywordWithoutSpaces) >= 0
  );
};

export const checkResultIncludesQuery = (
  result: string,
  query: string
): boolean => {
  return standardizeText(result).includes(standardizeText(query));
};


export  function getSimilarity(result: string, query: string) {
    if (query == ''){
        return 0
    }
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
export default function getRelevancy(value: string|undefined, query: string ) {
    if (!value ) return false
    if (!query ) return true
    return (
        checkResultIncludesQuery(value, query)||
        getSimilarity(query , query ) < 3
    )

}