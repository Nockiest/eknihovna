import axios from "axios";

const fetchUniqueValues = async (columnName: string): Promise<string[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/getUniqueValues`, {
      columnName
    });
    
    return response.data; // Adjust this line if the structure of the response changes
  } catch (error: any) {
    console.error("Error fetching unique values:", error.message);
    throw error; // Rethrow the error if necessary
  }
};

export default fetchUniqueValues;