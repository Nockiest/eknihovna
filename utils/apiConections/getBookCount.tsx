import axios from "axios";

export const genUniqueBookCount = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
    try {
      const res = await axios.get(`${apiUrl}/uniqueNamesCount`);
      console.log(res)
      return res.data;
    } catch (error) {
      console.error('Error fetching unique book count:', error);
      throw error;
    }
  };