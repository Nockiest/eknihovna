import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
  type DbSearch =   {
  id: number
  keyword: string
  fullquery: string
  popularity: number
}
const app = express();
app.use(cors());
const port = 3002;
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'postgres',
  password: 'OndPost06',
  port: 5432,
});

const mockData = {rows:[{"id":1,"name":"Bobea elatior Gaudich.","iban":"IE23 LSJW 9122 7020 8015 01","author":"Rog Enns","rating":80,"description":"vestibulum rutrum rutrum neque aenean auctor gravida sem praesent id massa id nisl venenatis lacinia aenean sit amet justo morbi","forMaturita":true,"available":false},
  {"id":2,"name":"Eriogonum codium Reveal, Caplow & K. Beck","iban":"GL85 1035 6131 3886 40","author":null,"rating":1,"description":"nec sem duis aliquam convallis nunc proin at turpis a pede posuere nonummy integer non velit donec diam neque vestibulum eget vulputate ut ultrices vel augue","forMaturita":false,"available":true},
  {"id":3,"name":"Desmodium styracifolium (Osbeck) Merr.","iban":"BH94 QPPX X51H 8OJR TC6D SP","author":"Joannes Jerrems","rating":35,"description":"nibh fusce lacus purus aliquet at feugiat non pretium quis lectus suspendisse potenti in eleifend quam a odio in hac habitasse platea dictumst maecenas ut massa quis augue luctus tincidunt nulla mollis molestie lorem quisque ut erat","forMaturita":true,"available":false},
  {"id":4,"name":"Quercus minima (Sarg.) Small","iban":"FR10 0417 3188 751Z S8NC KNWT E32","author":"Katharina Wogden","rating":34,"description":"amet cursus id turpis integer aliquet massa id lobortis convallis tortor risus dapibus augue vel accumsan tellus nisi","forMaturita":true,"available":false},
  {"id":5,"name":"Lecidea pycnocarpa (Körb.) Ohlert","iban":"SK51 4094 2726 4235 3462 3223","author":"Court Coston","rating":73,"description":"augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet ultrices erat tortor sollicitudin mi","forMaturita":true,"available":true},
  {"id":6,"name":"Clarkia mildrediae (A. Heller) F.H. Lewis & M.E. Lewis ssp. lutescens Gottlieb & L.P. Janeway","iban":"AT68 1790 3618 6799 8438","author":"Roxanna Frugier","rating":74,"description":"etiam faucibus cursus urna ut tellus nulla ut erat id mauris vulputate elementum nullam varius nulla facilisi cras non velit nec nisi vulputate","forMaturita":null,"available":false},
  {"id":7,"name":"Vicia hassei S. Watson","iban":"GE09 KU91 7754 3667 0534 54","author":"Rossy Kobpac","rating":96,"description":"et ultrices posuere cubilia curae nulla dapibus dolor vel est donec odio justo sollicitudin ut suscipit a feugiat et eros vestibulum ac est lacinia nisi venenatis tristique fusce congue diam id ornare imperdiet sapien urna pretium nisl ut volutpat sapien arcu","forMaturita":true,"available":false},
  {"id":8,"name":"Epidendrum mutelianum Cogn.","iban":"LB64 2421 F4LF JOOZ EVZZ O1TD O84Q","author":"Rollins Vasilik","rating":88,"description":"rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id turpis integer aliquet massa id lobortis convallis","forMaturita":true,"available":true},
  {"id":9,"name":"Cryptantha mohavensis (Greene) Greene","iban":"CH65 2202 7FQA DRIA EWCF 8","author":null,"rating":23,"description":"facilisi cras non velit nec nisi vulputate nonummy maecenas tincidunt lacus at velit vivamus vel nulla eget eros elementum pellentesque quisque porta volutpat","forMaturita":true,"available":true},
  {"id":10,"name":"Nicotiana L.","iban":"FR96 2717 6297 19FL NGQG LN84 097","author":"Malva MacConnal","rating":63,"description":"mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu nibh quisque id justo","forMaturita":false,"available":true},]}

app.get('/bookList', async (req: Request, res: Response) => {
  const { query } = req.query;
  // if ( query == ''){
  //   res.json({})
  // }
  // if (  typeof query !== 'string'){
  //   res.status(400).json({ error: 'Bad Request' });

  // }
  try {
    const results  = await pool.query(
      `SELECT * FROM books    `,
    );

    // const sanitizedResults = results.rows.map((value:DbSearch) => {

    //   return value

    // });
    // const filteredResults = sanitizedResults.filter((result) => {
    //   return checkSearchRelevant(result.keyword, query as string) || checkResultStartWithQuery(result.fullquery, query as string);
    // });
    // console.log(filteredResults)
    // filteredResults.sort((a, b) => {
    //   return getSimilarity(b.keyword, query as string) - getSimilarity(a.keyword, query as string)
    // })
    // res.json(filteredResults);
    res.json(results)
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const checkSearchRelevant = (keyword: string, query: string) => {
  if (query.replace(/\s/g, "") === ''){
    return false
  }
  const keywordWithoutSpaces = keyword.replace(/\s+/g, " ").trim();
  const queryWithoutSpaces = query.replace(/\s+/g, " ").trim();

  console.log( keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces),queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()), keywordWithoutSpaces, ' x ' , queryWithoutSpaces)
  return (
    keywordWithoutSpaces.toLocaleLowerCase().indexOf(queryWithoutSpaces.toLocaleLowerCase()) >= 0 ||  queryWithoutSpaces.toLocaleLowerCase().indexOf(keywordWithoutSpaces.toLocaleLowerCase()) >= 0
  );
};

const checkResultStartWithQuery = (result:string, query:string): boolean => {
  return  result.replace(/\s+/g, " ").trim().toLocaleLowerCase().indexOf( query.replace(/\s+/g, " ").trim().toLocaleLowerCase()) == 0
}

function getSimilarity (result:string, query:string) {
  result = result.toLowerCase()
  query = query.toLowerCase()
  console.log(result.length - result.replace(new RegExp(query, 'g'), '').length)
  return result.length - result.replace(new RegExp(query, 'g'), '').length
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});