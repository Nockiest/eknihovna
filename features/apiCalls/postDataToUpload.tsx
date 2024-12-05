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
      handleError(error?.response?.status, error?.response?.data.message)
    } else {
      console.error("An unexpected error occurred:", error);
      alert(`Došlo k neočekávané chybě: ${error}`);
    }
  }
};
function handleError(statusCode: number| undefined, errorMessage: string): void {
  if (!statusCode){
    console.error("Unexpected status code:", statusCode);
    alert(`Neočekávaný stavový kód: ${statusCode}`);
    return
  }

  if (statusCode >= 400 && statusCode < 500) {
    console.error("Client error:", errorMessage);
    alert(`Chyba na straně klienta: ${errorMessage}`);
  } else if (statusCode >= 500) {
    console.error("Server error:", errorMessage);
    alert(`Chyba na straně serveru: ${errorMessage}`);
  }
}