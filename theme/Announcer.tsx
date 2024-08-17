
import { Box, Typography } from '@mui/material'
import React from 'react'

const Announcer: React.FC<{ message: string | null, type: 'normal' | 'error' | 'warning' }> = ({ message, type }) => {
  let textColor = 'black'; // Default color

  if (type === 'error') {
    textColor = 'error';
  } else if (type === 'warning') {
    textColor = 'warning';
  }

  return (
    <Box
      className="w-full border-2 flex justify-center items-center "
    >
      <Typography variant="h6" color={textColor}>
      {message}

      </Typography>
      <p className='text-black'>{message}</p>
    </Box>
  );
}

export default Announcer