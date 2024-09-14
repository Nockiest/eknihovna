import axios from 'axios';
import { Book, Filters } from '@/types/types';
import { defaultFilters  } from '@/data/values';


export const fetchFilteredBooks = async (
  filters: Filters = defaultFilters,
  page: number = 1,
  id: string|null = null,
  limit: number = 10000000
): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  try {
    // debugger
    const response = await axios.post(`${apiUrl}/bookList`, { filters, page, limit, id });
    return  response.data || [];
  } catch (error: any) {
    throw new Error(`Problem with fetching data: ${error.message}`);
  }
};


// export const fetchFilteredBooks = async (
//   activeFilters: Filters = defaultFilters,
//   page: number = 1,
//   limit: number = 10000000
// ): Promise<Book[]> => {
//   // const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
//   try {
//     // debugger
//     // const response = await axios.post(`${apiUrl}/bookList`, { activeFilters, page, limit });
//     // console.log(response.data)
//   //  const books = await prisma.knihy.findMany()
//   //  console.log(books)
//     // return  response.data || [];
//     const prismaFilters = buildPrismaFilter(activeFilters);

//     // Calculate offset
//     const offset = (page - 1) * limit;

//     // Execute the Prisma query
//     const books = await prisma.knihy.findMany({
//       where: prismaFilters,
//       skip: offset,
//       take: limit,
//       distinct: ['name'], // Distinct on the 'name' field
//     });

//     // If you want to return the total count as well, you might need to run a separate query:
//     const totalCount = await prisma.knihy.count({ where: prismaFilters });
//     //total: totalCount,

//    return books
//   //  res.json({
//   //     books,
//   //   });
//   } catch (error: any) {
//     throw new Error(`Problem with fetching data: ${error.message}`);
//   }
// };
