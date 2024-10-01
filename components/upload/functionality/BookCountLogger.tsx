import { PrimaryButton } from '@/theme/buttons/Buttons';
import axios from 'axios';
import React from 'react'

const BookCountLogger = ( ) => {

    const checkData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/logDb`);
          alert(`Aktuální počet knih: ${response.data.count || 0}`);
        } catch (error: any) {
          console.error("Chyba při získávání dat ze serveru:", error.message);
          alert("Chyba při získávání dat: " + error.message);
        }
      };
  return (
    <PrimaryButton onClick={checkData}>Získat aktuální počet knih</PrimaryButton>
  )
}

export default BookCountLogger