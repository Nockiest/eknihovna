import axios from 'axios';
import { Book } from '@/types/types';

export const getBooksByQuery = async (query = ''): Promise<Book[]> => {
  try {
    const response = await axios.get("http://localhost:3002/bookList", { params: {   query} });
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
