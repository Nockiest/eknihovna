// src/components/ThemedButtons.tsx
'use client'
import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  zIndex: 0,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export const NavbarButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
    zIndex: 0,
    padding: '16px 24px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
    '&.MuiButton-containedPrimary': {
      backgroundColor: theme.palette.secondary.dark,
      color: theme.palette.primary.contrastText,
      '&:active': {
        backgroundColor: theme.palette.primary.light,
      },
    },
  //   '&.active': {
  //     backgroundColor: theme.palette.primary.dark,
  //     color: theme.palette.primary.contrastText,
  //     // '&:active': {
  //     //   backgroundColor: theme.palette.primary.light,
  //     // },
  // }
}
));




const ThemedButtons = () => {
  return (
    <div className="space-x-4 z-0">
      <PrimaryButton variant="contained">Primary Button</PrimaryButton>
      <SecondaryButton variant="contained">Secondary Button</SecondaryButton>
      <NavbarButton variant="contained" className='MuiButton-containedPrimary' >Navbar</NavbarButton>
      {/*ading this makes the button look activve =>'MuiButton-containedPrimary' */}
    </div>
  );
};

export default ThemedButtons;