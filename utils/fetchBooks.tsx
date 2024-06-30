import axios from 'axios';
import { Book, Filters } from '@/types/types';


export const getBooksByQuery = async (filters: Filters = {}): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/bookList`, { filters });
    const data = response.data;

    if (data === null) {
      return [];
    }

    const knihy: Book[] = data;
    return knihy;
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error}`);
  }
};
