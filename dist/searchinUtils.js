"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSimilarity = exports.checkResultStartWithQuery = exports.checkSearchRelevant = void 0;
const checkSearchRelevant = (keyword, query) => {
    if (query.replace(/\s/g, '') === '') {
        return false;
    }
    const keywordWithoutSpaces = keyword.replace(/\s+/g, ' ').trim();
    const queryWithoutSpaces = query.replace(/\s+/g, ' ').trim();
    return (keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces.toLocaleLowerCase()) >= 0 ||
        queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()) >= 0);
};
exports.checkSearchRelevant = checkSearchRelevant;
const checkResultStartWithQuery = (result, query) => {
    return result.replace(/\s+/g, ' ').trim().toLocaleLowerCase().indexOf(query.replace(/\s+/g, ' ').trim().toLocaleLowerCase()) == 0;
};
exports.checkResultStartWithQuery = checkResultStartWithQuery;
function getSimilarity(result, query) {
    result = result.toLowerCase();
    query = query.toLowerCase();
    return result.length - result.replace(new RegExp(query, 'g'), '').length;
}
exports.getSimilarity = getSimilarity;
