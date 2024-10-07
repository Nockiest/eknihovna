export const standardizeText = (text: string) => {
  return text.replace(/\s+/g, " ").trim().toLocaleLowerCase();
};

export const checkResultIncludesQuery = (
  result: string,
  query: string
): boolean => {
  return standardizeText(result).includes(standardizeText(query));
};

export const checkSearchRelevant = (keyword: string , query : string) => {
    if (query.replace(/\s/g, "") === ''){
      return false
    }
    const keywordWithoutSpaces = keyword.replace(/\s+/g, " ").trim();
    const queryWithoutSpaces = query.replace(/\s+/g, " ").trim();
    return (
      keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces.toLocaleLowerCase()) >= 0 ||  queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()) >= 0
    );
  };
// self explanatory
export const checkResultStartWithQuery = (result: string , query: string  )  => {
    return  result.replace(/\s+/g, " ").trim().toLocaleLowerCase().indexOf( query.replace(/\s+/g, " ").trim().toLocaleLowerCase()) == 0
  }
// gets how similar one string is to another
export function getSimilarity (result: string , query : string) {
    result = result.toLowerCase()
    query = query.toLowerCase()

    return result.length - result.replace(new RegExp(query, 'g'), '').length
  }
// checks whether the word is misspelled
// note that to show results passed through this function in the front end you
// should add to the check in the querylist table for the index of query
export function levenshteinDistance(word1: string, word2: string) {
    const m = word1.length;
    const n = word2.length;

    // Create a 2D matrix to store the distances
    const dp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    // Initialize the first row and column of the matrix
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    // Calculate the distances
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // Deletion
            dp[i][j - 1] + 1, // Insertion
            dp[i - 1][j - 1] + 1 // Substitution
          );
        }
      }
    }

    // Return the distance between the two words
    return dp[m][n];
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
    if (!query || query.trim() ==='' ) return true
    return (
        checkResultStartWithQuery(value,query)||
        checkResultIncludesQuery(value, query)||
        getSimilarity(query , query ) < 3
        //||
        // levenshteinDistance(value, query) < 3
    )

}