import { Box, Paper, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const BookPreview = () => {
  return (
    <Paper>
       <Box >
         <Image src={''} alt={'prebal knihy'} height={50} width={50}/>
         <Typography>Název</Typography>
         <Typography>Zanr</Typography>
       </Box>

       <Typography>Název</Typography>

    </Paper>
  )
}

export default BookPreview