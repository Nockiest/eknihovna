import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface MessageProps {
  message: string;
  date: string;
}

const Message: React.FC<MessageProps> = ({ message, date }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
      <Typography variant="caption" color="textPrimary" align="right">
        {date}
      </Typography>
    </Paper>
  );
};

export default Message;
