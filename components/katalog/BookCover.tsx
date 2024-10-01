import Image from 'next/image';
import { Box, Typography } from '@mui/material';
interface BookCoverProps {
  width: string;
}

const BookCover: React.FC<BookCoverProps> = ({ width }) => {
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
        src='/img/placeholderImage.png'
        alt='knižní přebaly přijdou v jiné verzi'
        layout='fill'
      />
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
    </Box>
  );
};

export default BookCover;