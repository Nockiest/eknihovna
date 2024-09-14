import { TextField, Box, styled } from '@mui/material';

// Create a custom styled input component using MUI's styled API
const StyledInput = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
      borderRadius: '8px', // Rounded corners
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#f9fafb', // Light or dark background
      border: '1px solid',
      margin: '0px',
      padding: '0px',
      fontSize: '12px', // Smaller text size
      height: '30px', // Adjust height to make it smaller
      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : '#d1d5db', // Light or dark border
      '&.Mui-focused': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.light}`, // Blue focus ring
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '12px', // Smaller label size
      color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : theme.palette.grey[900],
    },
    '& .MuiOutlinedInput-input': {
      padding: '4px 8px', // Reduce padding inside the input field
    },
  }));

export default  StyledInput