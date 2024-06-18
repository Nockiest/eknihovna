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

export   const checkResultStartWithQuery = (result: string, query: string): boolean => {
    return result.replace(/\s+/g, ' ').trim().toLocaleLowerCase().indexOf(query.replace(/\s+/g, ' ').trim().toLocaleLowerCase()) == 0;
  };

 export  function getSimilarity(result: string, query: string) {
    result = result.toLowerCase();
    query = query.toLowerCase();
    return result.length - result.replace(new RegExp(query, 'g'), '').length;
  }