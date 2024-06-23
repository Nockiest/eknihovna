import React from 'react';
import { Typography, Box, Grid } from '@mui/material';

const OpeningHours: React.FC = () => {
  // Data for days and opening hours (assuming a static data structure)
  const days = [
    { day: 'Pondělí', hours: '8:00 - 18:00' },
    { day: 'Úterý', hours: '8:00 - 18:00' },
    { day: 'Středa', hours: '8:00 - 18:00' },
    { day: 'Čtvrtek', hours: '8:00 - 18:00' },
    { day: 'Pátek', hours: '8:00 - 16:00' },
  ];

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
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