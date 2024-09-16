import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'text': {
          50: '#131603',
          100: '#262d06',
          200: '#4c590d',
          300: '#738613',
          400: '#99b319',
          500: '#bfdf20',
          600: '#cce64c',
          700: '#d9ec79',
          800: '#e5f2a6',
          900: '#f2f9d2',
          950: '#f9fce9',
        },
        'background': {
          50: '#131604',
          100: '#272b08',
          200: '#4e5610',
          300: '#758118',
          400: '#9cac20',
          500: '#c3d728',
          600: '#cfdf53',
          700: '#dbe77e',
          800: '#e7efa9',
          900: '#f3f7d4',
          950: '#f9fbe9',
        },
        'primary': {
          50: '#0f0c0b',
          100: '#1d1716',
          200: '#3b2e2b',
          300: '#584541',
          400: '#755c57',
          500: '#93736c',
          600: '#a88f8a',
          700: '#beaba7',
          800: '#d4c7c4',
          900: '#e9e3e2',
          950: '#f4f1f0',
        },
        'secondary': {
          50: '#170703',
          100: '#2d0e06',
          200: '#5b1b0b',
          300: '#882911',
          400: '#b63616',
          500: '#e3441c',
          600: '#e96949',
          700: '#ee8f77',
          800: '#f4b4a4',
          900: '#f9dad2',
          950: '#fcece8',
        },
        'accent': {
          50: '#110b08',
          100: '#231610',
          200: '#462c20',
          300: '#694230',
          400: '#8c5840',
          500: '#af6e50',
          600: '#bf8b73',
          700: '#cfa896',
          800: '#dfc5b9',
          900: '#efe2dc',
          950: '#f7f1ee',
        },
       },

    },
  },
  safelist: [
    {
      pattern: /bg-(primary|secondary|background|accent|text)-[0-9]{1,3}/,
    },
  ],
  plugins: [],
};
export default config;
