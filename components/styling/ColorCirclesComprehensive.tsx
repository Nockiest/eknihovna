'use client'
import  { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PrimaryButton } from '@/theme/buttons/Buttons';

const ColorCirclesComprehensive = () => {
  // Add state to trigger a re-render
  const [_, setRerender] = useState(false);

  const tailwindColors = [
    {
      label: 'Primary',
      colorKey: 'primary',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    {
      label: 'Secondary',
      colorKey: 'secondary',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    {
      label: 'Background',
      colorKey: 'background',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    {
      label: 'Accent',
      colorKey: 'accent',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
    {
      label: 'Text',
      colorKey: 'text',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
    },
  ];

  return (
    <Box display="flex" className="flex flex-col gap-4 p-2">
      {tailwindColors.map((colorItem) => (
        <Box key={colorItem.label} className="mb-4">
          <Typography variant="body2" gutterBottom>
            {colorItem.label}
          </Typography>
          <Box
            display="flex"
            className="flex flex-row flex-wrap gap-4"
            justifyContent="start"
            alignItems="center"
          >
            {colorItem.shades.map((shade) => (
              <Box key={shade} textAlign="center">
                <Box
                  className={`w-10 h-10 rounded-full bg-${colorItem.colorKey}-${shade}`}
                  mb={1}
                />
                <Typography variant="body2">{shade}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
      {/* A sample circle */}
      <Box className={`w-10 h-10 rounded-full bg-secondary-300`} textAlign="center" />
      {/* Add a button to trigger re-render */}
      <PrimaryButton
        variant="contained"
        color="primary"
        onClick={() => setRerender(prev => !prev)}
      >
        Force Re-render
      </PrimaryButton>
    </Box>
  );
};

export default ColorCirclesComprehensive;
