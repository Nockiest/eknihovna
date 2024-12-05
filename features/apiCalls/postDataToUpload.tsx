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
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle specific status codes
        if (error.response.status >= 400 && error.response.status < 500) {
          console.error("Client error:", error.response.data.message);
          alert(`Chyba na straně klienta: ${error.response.data.message}`);
        } else if (error.response.status >= 500) {
          console.error("Server error:", error.response.data.message);
          alert(`Chyba na straně serveru: ${error.response.data.message}`);
        }
      } else {
        console.error("No response received:", error.message);
        alert(`Žádná odpověď nebyla přijata: ${error.message}`);
      }
    } else {
      console.error("An unexpected error occurred:", error);
      alert(`Došlo k neočekávané chybě: ${error}`);
    }
  }
};
