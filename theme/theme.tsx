// src/theme.js
"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
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
  
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
  },
});

export default theme;
