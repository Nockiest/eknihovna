import axios from 'axios';
import { Book, Filters } from '@/types/types';
import { defaultFilters, prisma } from '@/data/values';


export const getBooksByQuery = async (
  filters: Filters = defaultFilters,
  page: number = 1,
  limit: number = 10000000
): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  try {
    // debugger
    const response = await axios.post(`${apiUrl}/bookList`, { filters, page, limit });
    // console.log(response.data)
  //  const books = await prisma.knihy.findMany()
  //  console.log(books)
    return  response.data || [];
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error.message}`);
  }
};
