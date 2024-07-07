import axios from 'axios';
import { Book, Filters } from '@/types/types';
import { defaultFilters } from '@/data/values';


export const getBooksByQuery = async (filters: Filters = defaultFilters): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/bookList`, { filters });
    return response.data || [];
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error.message}`);
  }
};
