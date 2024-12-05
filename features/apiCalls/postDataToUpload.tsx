import catchError from "@/utils/catchError";
import handleErrorStatus from "@/utils/handleErrorStatus";
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
  async function upload() {
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
  }
  const [error, response] = await catchError(upload());
  if (error) {
    if (axios.isAxiosError(error)) {
      handleErrorStatus(error?.response?.status, error?.response?.data.message);
    } else {
      console.error("An unexpected error occurred:", error);
      alert(`Došlo k neočekávané chybě: ${error}`);
    }
  }
  return response;
};
