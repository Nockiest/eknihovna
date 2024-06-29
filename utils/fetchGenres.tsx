import axios from "axios";

export const fetchGenres = async () :Promise<string[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  try {
    const response = await axios.get(`${apiUrl}/getGenres`);

    // console.log("Array Column Values:", response.data);
    return response.data
  } catch (error: any) {
    console.error("Error fetching values:", error.message);
    throw error; // Rethrow the error if necessary
  }
};
