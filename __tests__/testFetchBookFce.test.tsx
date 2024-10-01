// fetchFilteredBooks.test.ts
import { defaultFilters, testBook } from '@/data/values';
import { fetchFilteredBooks } from '@/utils/apiConections/fetchFilteredBooks';
import axios from 'axios';

jest.mock('axios');

describe('fetchFilteredBooks', () => {
  const mockBooks = [testBook];

  it('should fetch books successfully', async () => {
    // Mock the axios.post call to return a successful response
    (axios.post as jest.Mock).mockResolvedValue({
      data: mockBooks
    });

    const books = await fetchFilteredBooks();

    // Assert the response
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_APP_API_URL}/bookList`,
      { filters: defaultFilters, page: 1, limit: 10000000, id: null }
    );
    expect(books).toEqual(mockBooks);
  });

  it('should handle API errors', async () => {
    // Mock the axios.post call to return an error
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network Error'));

    // Assert that the function throws the expected error
    await expect(fetchFilteredBooks()).rejects.toThrow('Problem with fetching data: Network Error');
  });
});