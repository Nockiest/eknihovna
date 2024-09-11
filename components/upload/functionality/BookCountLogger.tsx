import { PrimaryButton } from '@/theme/buttons/Buttons';
import axios from 'axios';
import React from 'react'

const BookCountLogger = ({setResponseMessage}:{setResponseMessage: React.Dispatch<React.SetStateAction<string | null>>;}) => {

    const checkData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/logDb`);
          setResponseMessage(`Aktuální počet knih: ${response.data.count || 0}`);
        } catch (error: any) {
          console.error("Chyba při získávání dat ze serveru:", error.message);
          setResponseMessage("Chyba při získávání dat: " + error.message);
        }
      };
  return (
    <PrimaryButton onClick={checkData}>Získat aktuální počet knih</PrimaryButton>
  )
}

export default BookCountLogger