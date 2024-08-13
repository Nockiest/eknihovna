import { useSearchContext } from '@/app/katalog/context'
import { Box, Typography } from '@mui/material'
import React from 'react'

const ErrorReporter: React.FC<{ errorMessage: string | null }> = ({ errorMessage }) => {
  return (
    <Box
    className="w-full flex justify-center items-center"
    style={{ height: "100vh" }}
  >
    <Typography variant="h6" color="error">
    {errorMessage}
    </Typography>
  </Box>
  )
}

export default ErrorReporter
