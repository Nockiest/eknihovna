import React from 'react';
import  Button from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

interface CustomHamburgerProps {
  onClick: () => void;
  ariaLabel: string;
}

const CustomIconButton = styled(Button)(({ theme }) => ({
//   backgroundColor: 'transparent',
//   border: 0,
//   cursor: 'pointer',
//   position: 'absolute',
//   right: '15px', // Tailwind `right-10`
//   top: '15px', // Tailwind `top-4`
//   zIndex: 3,
//   margin: '1rem', // Tailwind `m-4`
//   padding: '1rem', // Tailwind `p-4`
//   '&:hover': {
//     backgroundColor: 'transparent',
//   },
}));

const HamburgerSpan = styled('span')({
  /* Add your hamburger span styles here */
});

const CustomHamburger: React.FC<CustomHamburgerProps> = ({ onClick, ariaLabel }) => {
  return (
    <CustomIconButton  className={'nav-toggle nav-toggle bg-transparent border-0 cursor-pointer absolute right-10 top-0 z-3 m-4 p-4'} onClick={onClick} aria-label={ariaLabel}>
      <HamburgerSpan className="hamburger" />
    </CustomIconButton>
  );
};

export default CustomHamburger;