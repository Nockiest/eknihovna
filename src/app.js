"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = 3002;
const pool = new pg_1.Pool({
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: 'OndPost06',
    port: 5432,
});
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.query;
    // if ( query == ''){
    //   res.json({})
    // }
    // if (  typeof query !== 'string'){
    //   res.status(400).json({ error: 'Bad Request' });
    // }
    try {
        const results = yield pool.query(`SELECT * FROM queries    `);
        // if ( !Array.isArray(results)  ){
        //     res.status(404).json({ error: 'Database has bugs' });
        // }
        // if (!(results[0] instanceof DbSearch)) {
        //   res.status(404).json({ error: 'Database has bugs' });
        // }
        const sanitizedResults = results.rows.map((value) => {
            return value;
        });
        const filteredResults = sanitizedResults.filter((result) => {
            return checkSearchRelevant(result.keyword, query) || checkResultStartWithQuery(result.fullquery, query);
        });
        console.log(filteredResults);
        filteredResults.sort((a, b) => {
            return getSimilarity(b.keyword, query) - getSimilarity(a.keyword, query);
        });
        res.json(filteredResults);
    }
    catch (error) {
        console.error('Error executing search query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
const checkSearchRelevant = (keyword, query) => {
    if (query.replace(/\s/g, "") === '') {
        return false;
    }
    const keywordWithoutSpaces = keyword.replace(/\s+/g, " ").trim();
    const queryWithoutSpaces = query.replace(/\s+/g, " ").trim();
    console.log(keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces), queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()), keywordWithoutSpaces, ' x ', queryWithoutSpaces);
    return (keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces.toLocaleLowerCase()) >= 0 || queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()) >= 0);
};
const checkResultStartWithQuery = (result, query) => {
    return result.replace(/\s+/g, " ").trim().toLocaleLowerCase().indexOf(query.replace(/\s+/g, " ").trim().toLocaleLowerCase()) == 0;
};
function getSimilarity(result, query) {
    result = result.toLowerCase();
    query = query.toLowerCase();
    console.log(result.length - result.replace(new RegExp(query, 'g'), '').length);
    return result.length - result.replace(new RegExp(query, 'g'), '').length;
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
