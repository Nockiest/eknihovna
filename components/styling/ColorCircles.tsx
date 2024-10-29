import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const ColorCircles = () => {
  const theme = useTheme();

  const colors = [
    { label: 'Primary', color: theme.palette.primary.main },
    { label: 'Secondary', color: theme.palette.secondary.main },
    { label: 'Background', color: theme.palette.background.default },
    { label: 'Accent', color: theme.palette.error.main }, // Assuming 'error' is used for accent color
    { label: 'Text', color: theme.palette.text.primary }
  ];

  return (
    <Box display="flex" justifyContent="space-around" alignItems="center" p={2}>
      {colors.map((colorItem) => (
        <Box key={colorItem.label} textAlign="center">
          <Box
            width={50}
            height={50}
            borderRadius="50%"
            bgcolor={colorItem.color}
            mb={1}
          />
          <Typography variant="body2">{colorItem.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ColorCircles;
