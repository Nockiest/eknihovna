import React from 'react';
import { Typography, Box, Grid } from '@mui/material';

const OpeningHours: React.FC = () => {
  // Data for days and opening hours (assuming a static data structure)
  const days = [
    { day: 'Pondělí', hours: '13:30 - 16:00' },
    { day: 'Úterý', hours: '12:35 - 15:35' },
    { day: 'Středa', hours: '13:30 - 15:30' },
    { day: 'Čtvrtek', hours: '12:35 - 15:35' },
    { day: 'Pátek', hours: '13:30 - 14:00' },
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom className='text-center lg:text-left'>
        Otevírací doba
      </Typography>
      <Grid container spacing={2}>
        {days.map((day, index) => (
          <Grid key={index} item xs={12} sm={6}>
            {/* xs={12} for full width on small screens, sm={6} for half width on medium screens and above */}
            <Box border={1} p={2} borderRadius={4} height="100%">
              <Typography variant="subtitle1" gutterBottom>
                {day.day}
              </Typography>
              <Typography variant="body1">{day.hours}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OpeningHours;
