import { DangerButton } from '@/theme/buttons/Buttons'
import axios from 'axios';

const BookDeleter = ({ setResponseMessage }: { setResponseMessage: React.Dispatch<React.SetStateAction<string | null>>; }) => {

  const deleteData = async () => {
    const userConfirmed = window.confirm("Opravdu chcete smazat všechny knihy?");
    if (!userConfirmed) {
      return; // Exit if the user doesn't confirm
    }

    try {
      debugger
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_APP_API_URL}/upload`,
        {
          data: { id:-1 }, // Include the ID in the request body if your API expects it this way
        }
      );
      setResponseMessage(response.data.message);
    } catch (error: any) {
      console.error("Chyba při mazání dat ze serveru:", error.message);
      setResponseMessage("Chyba při mazání dat: " + error.message);
    }
  };

  return (
    <DangerButton onClick={deleteData}>Smazat knihy</DangerButton>
  );
}

export default BookDeleter;
