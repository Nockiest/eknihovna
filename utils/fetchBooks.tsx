import axios from 'axios';
import { Book, Filters } from '@/types/types';


export const getBooksByQuery = async (filters: Filters = {
  name:null,
  author: [],
  category: [],
  genres: [],
  formaturita : null,
  available: null
}): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/bookList`, { filters });
    return response.data || [];
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error.message}`);
  }
};
