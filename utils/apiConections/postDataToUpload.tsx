import { UploadJsonData } from '@/types/types';
import axios from 'axios';

 
export const postDataToEndpoint = async (
    jsonData: UploadJsonData // This allows any key with any value type
  ): Promise<any> => {
    const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
    try {
      const response = await axios.post(`${apiUrl}/upload`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error making POST request:', error);
      throw new Error(`Failed to post data: ${error.message}`);
    }
  };
