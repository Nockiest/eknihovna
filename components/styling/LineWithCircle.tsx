import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const LineContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '2px',
  backgroundColor: 'black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px 0'
});

const Dot = styled(Box)({
  position: 'absolute',
  width: '10px',
  height: '10px',
  backgroundColor: 'black',
  borderRadius: '50%',
  top: '-4px' // Adjust to center the dot vertically
});

const HorizontalLineWithDot: React.FC = () => {
  return (
    <LineContainer>
      <Dot />
    </LineContainer>
  );
};

export default HorizontalLineWithDot;
