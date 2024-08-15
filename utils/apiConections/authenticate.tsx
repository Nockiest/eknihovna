import axios from "axios";

export const authenticate = async (event: React.FormEvent<HTMLFormElement>,password:string) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/authenticate`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return true

      } else {
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };
