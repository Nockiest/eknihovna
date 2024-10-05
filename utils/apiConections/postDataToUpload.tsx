import axios from "axios";

export const postDataToUpload = async (
  books: any, // This allows any key with any value type,
  removePreviousData: boolean = false
): Promise<any> => {
  const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  const reqObj = {
    books,
    removePreviousData,
  };
  try {
    const response = await axios.post(
      `${apiUrl}/upload`,
      JSON.stringify(reqObj),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error: any) {
    console.error("Error making POST request:", error);
    throw new Error(`Failed to post data: ${error.message}`);
  }
};
