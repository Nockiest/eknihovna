import Image from 'next/image';
import { Box } from '@mui/material';

const BookCover = () => {
  return (
    <Box
      p={2}
      sx={{
        position: 'relative',
        width: '111px', // Width for aspect ratio 3:4 (height is 4/3 of the width)
        height: '148px', // Height for aspect ratio 3:4 (height is 4/3 of the width)
        '& img': {
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        },
        margin: '0 auto'
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
