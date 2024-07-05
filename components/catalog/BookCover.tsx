import Image from 'next/image';
import { Box } from '@mui/material';
interface BookCoverProps {
  width: string;
}

const BookCover: React.FC<BookCoverProps> = ({ width }) => {
  // const width = '200px'; // Set the desired width percentage

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
    </Box>
  );
};

export default BookCover;