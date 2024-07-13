'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const Page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   const apiUrl = process.env.NEXT_PUBLIC_APP_API_URL;
  //   console.log(apiUrl);
  //   try {
  //     const response = await axios.post(`${apiUrl}/login`, {
  //       username,
  //       password,
  //     });

  //     const data = response.data;

  //     if (response.status === 200) {
  //       // Set the token received from the server
  //       Cookies.set('authToken', data.token, { expires: 1 }); // Expires in 1 day
  //       console.log('Login successful, auth set', data.token);
  //       router.push('/upload'); // Redirect to /upload
  //     } else {
  //       console.log(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Unexpected error:', error);
  //   }
  // };


  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* <form onSubmit={handleSubmit}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form> */}
    </Box>
  );
};

export default Page;
