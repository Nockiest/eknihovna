'use client'

import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import getBookCoverURL from '@/utils/getBookCover';
interface BookCoverProps {
  width: string;
  isbn: string;
}

const BookCover: React.FC<BookCoverProps> = ({ width,isbn }) => {
   const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCover = async () => {
      try {
        const url = await getBookCoverURL(isbn);
        setCoverUrl(url);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchCover();
  }, [isbn]);

  //   if (error) {
  //   return <p>{error}</p>; // Zobrazení chybové zprávy
  // }

  // if (!coverUrl) {
  //   return <p>Načítání obálky knihy...</p>; // Zpráva, dokud se obrázek načítá
  // }
  const failedFetchingCover = !coverUrl || error

  return (
    <Box
      p={2}
      sx={{
        position: 'relative',
        width: width,
        height: `auto`, // Calculate height to maintain 3:4 aspect ratio
        '& img': {
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        },
        margin: '0 auto',
        flexGrow: '1'
      }}
    >
      <Image
        src={failedFetchingCover? '/img/placeholderImage.png':coverUrl}
        alt='knižní přebaly přijdou v jiné verzi'
        layout='fill'
      />
      {failedFetchingCover&&
       <Typography
       variant="body1"
       sx={{
         position: 'absolute',
         // top: '50%',
         left: '0',
         right: "0",
         width: '100%',
         // transform: 'translate(-50%, -50%)',
         backgroundColor: 'rgba(0, 0, 0, 0.6)',
         color: 'white',
         padding: '10px',
         borderRadius: '4px',
       }}
     >
       Přebaly knih přidáme co nejdříve
     </Typography>
      }

    </Box>
  );
};

export default BookCover;


// const BookCover = ({ isbn }: { isbn: string }) => {
//   const [coverUrl, setCoverUrl] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCover = async () => {
//       try {
//         const url = await getBookCoverURL(isbn);
//         setCoverUrl(url);
//       } catch (err) {
//         setError((err as Error).message);
//       }
//     };

//     fetchCover();
//   }, [isbn]);

//   if (error) {
//     return <p>{error}</p>; // Zobrazení chybové zprávy
//   }

//   if (!coverUrl) {
//     return <p>Načítání obálky knihy...</p>; // Zpráva, dokud se obrázek načítá
//   }

//   return (
//     <Image
//       src={coverUrl}
//       alt="Obrázek knihy"
//       width={200}
//       height={300}
//     />
//   );
// };

// export default BookCover;