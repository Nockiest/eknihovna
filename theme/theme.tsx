// src/theme.js
"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  spacing: 8,
  typography: {
    h1: {
      fontSize: '2.4rem',
      '@media (min-width:600px)': {
        fontSize: '2.8rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '3.6rem',
      },
    },
    h2: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.4rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '3rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '2.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '1.75rem',
      },
    },
    h6: {
      fontSize: '1rem',
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '1.5rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (min-width:600px)': {
        fontSize: '1.1rem',
      },
      [createTheme().breakpoints.up('md')]: {
        fontSize: '1.2rem',
      },
    },
  },
  palette: {
    primary: {
      main: "#93736c", // primary 500
      light: "#beaba7", // primary 700
      dark: "#584541", // primary 300
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e3441c", // secondary 500
      light: "#ee8f77", // secondary 700
      dark: "#882911", // secondary 300
      contrastText: "#ffffff",
    },

    text: {
      primary: '#131603',
      secondary: '#99b319'
    },
    background: {
      default: "#ee8f77", // secondary 500


      },
    },


  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          margin: '16px', // default margin
          [createTheme().breakpoints.down('sm')]: {
            margin: '8px', // smaller screens
          },
          [createTheme().breakpoints.up('md')]: {
            margin: '24px', // medium screens
          },
          [createTheme().breakpoints.up('lg')]: {
            margin: '32px', // large screens
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
          zIndex: 0,
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },

});
export default theme;
