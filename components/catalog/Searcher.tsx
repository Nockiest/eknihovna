import React from 'react';
import { Slide, Paper, useTheme } from '@mui/material';
import SearchBar from './SearchBar';

interface SearcherProps {
  isOpen: boolean;
}

const Searcher: React.FC<SearcherProps> = ({ isOpen }) => {
  const classes = useTheme();

  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75%',
          maxWidth: '600px', // Optional: Limit maximum width if needed
          zIndex: 999, // Adjust z-index as necessary
          padding: '16px', // Adjust padding as necessary
        }}
      >
        <SearchBar />
      </Paper>
    </Slide>
  );
};

export default Searcher;
