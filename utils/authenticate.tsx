import { knihyURL } from "@/data/values";
import axios from "axios";

export const authenticate = async (event: React.FormEvent<HTMLFormElement>,password:string) => {
    event.preventDefault();
    // const knihyURL =
    // process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:3002"; // Adjust URL as per your backend setup

    try {
      const response = await axios.post(
        `${knihyURL}/authenticate`,
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
