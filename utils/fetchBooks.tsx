import axios from 'axios';
import { Book, Filters } from '@/types/types';
import { defaultFilters } from '@/data/values';


export const getBooksByQuery = async (
  filters: Filters = defaultFilters,
  page: number = 1,
  limit: number = 10000000
): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  try {
    const response = await axios.post(`${apiUrl}/bookList`, { filters, page, limit });
    console.log(response.data)
    return response.data || [];
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error.message}`);
  }
};
