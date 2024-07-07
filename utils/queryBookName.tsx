import { defaultFilters } from '@/data/values';
import { Book, Filters } from '@/types/types';
import axios from 'axios';

export async function queryBookName(bookName: string, filters: Filters=defaultFilters): Promise<Book[] | undefined> {
    const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
    const params = {
        bookName,
        filters: {...filters   }
    };
    console.log(params.filters.available === false)

    try {
        const response = await axios.get(`${apiUrl}/search`, { params });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error making search request:', error);
        return undefined; // Explicitly return undefined wrapped in a Promise
    }
}
