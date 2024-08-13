import { useSearchContext } from '@/app/katalog/context'
import { Box, Typography } from '@mui/material'
import React from 'react'

const Announcer: React.FC<{ message: string | null, type: 'normal' | 'error' | 'warning' }> = ({ message, type }) => {
  let textColor = 'inherit'; // Default color

  if (type === 'error') {
    textColor = 'error';
  } else if (type === 'warning') {
    textColor = 'warning';
  }

  return (
    <Box
      className="w-full flex justify-center items-center"
      style={{ height: "100vh" }}
    >
      <Typography variant="h6" color={textColor}>
        {message}
      </Typography>
    </Box>
  );
}

export default Announcer