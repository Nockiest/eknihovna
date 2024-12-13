import { Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const MaturitaBookListLink = () => {
  return (
    <Link
    className=" text-blue-500 mx-auto hover:underline flex justify-center"
    href="https://drive.google.com/file/d/18zk9IG9MlaM3cdiUdRVc0s11h7FJ_LcV/view"
  >
    <Typography className="mx-auto text-center align-center">
      Seznam maturitní četby a maturitní okruhy 2024/25
    </Typography>
  </Link>
  )
}

export default MaturitaBookListLink