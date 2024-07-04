// src/theme.js
"use client";
import { createTheme } from "@mui/material/styles";
import { Margarine } from "next/font/google";
const rootPalette = {
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
    secondary: '#ffffff'
  },
  background: {
    default: "#ee8f77", // secondary 500

// this is the accent color
    },
    error:{
      main: '#C42C0E'
    }
  }

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
      main: rootPalette.primary.main , // primary 500
      light: rootPalette.primary.light, // primary 700
      dark: rootPalette.primary.dark, // primary 300
      contrastText: rootPalette.primary.contrastText,
    },
    secondary: {
      main: rootPalette.secondary.main, // secondary 500
      light: rootPalette.secondary.light, // secondary 700
      dark: rootPalette.secondary.dark, // secondary 300
      contrastText: rootPalette.secondary.contrastText,
    },

    text: {
      primary: rootPalette.text.primary ,
      secondary: rootPalette.text.secondary
    },
    background: {
      default:  rootPalette.background.default, // secondary 500

// this is the accent color
      },
      error:{
        main: '#C42C0E'
      }
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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: rootPalette.primary.main, // Primary color
            },
            "&:hover fieldset": {
              borderColor: rootPalette.primary.main, // Primary color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: rootPalette.primary.main, // Primary color when focused
            },
            color: rootPalette.text.primary, // Text color
          },
          "& .MuiInputLabel-root": {
            color:  rootPalette.text.primary, // Label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color:  rootPalette.text.primary, // Label color when focused
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: rootPalette.text.primary, // Primary color
            },
            "&:hover fieldset": {
              borderColor:  rootPalette.text.primary, // Primary color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor:  rootPalette.text.primary, // Primary color when focused
            },
            color:  rootPalette.text.primary, // Text color
          },
          "& .MuiInputLabel-root": {
            color:  rootPalette.text.primary, // Label color
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color:  rootPalette.text.primary, // Label color when focused
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)', // Background color on hover
          },
          '&:focus': {
            outline: `2px solid ${rootPalette.primary.dark}`, // Outline when focused
            color: rootPalette.primary.dark
          },
          '&:disabled': {
            color: 'rgba(0, 0, 0, 0.38)', // Color when disabled
          },
          '&.Mui-checked': {
            // outline: `2px solid ${rootPalette.primary.dark}`,
            color: rootPalette.primary.dark, // Tick color when checked
            backgroundColor: rootPalette.primary.light, // Background color when checked
            '& .MuiSvgIcon-root': {
              fill: rootPalette.primary.dark, // Tick color when checked
            },
            icon: {
              color: 'white',
            },
          },
          '&.MuiCheckbox-root': {
            // outline: `2px solid ${rootPalette.primary.light}`, // Outline when not checked
             color: rootPalette.primary.light,
             width: 20,
             height: 20,
             margin: '2px',
             "& svg": {
               fontSize: 20,
             },
          },
        },
      },
    },
  }
});
export default theme;
