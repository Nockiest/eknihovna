import axios from 'axios';
import { Book } from '@/types/types';

// const apiUrl =  process.env.LOCAL_APP_API_URL;


export const getBooksByQuery = async (query = ''): Promise<Book[]> => {

  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  console.log(apiUrl)
  try {
    const response = await axios.get(`${apiUrl}/bookList`, { params: {   query} });
    const data = response.data;

    if (data === null) {
      return [];
    }

    const knihy: Book[] = data.rows;

    return knihy;
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error}`);
  }
};
