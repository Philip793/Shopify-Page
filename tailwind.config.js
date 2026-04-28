/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", // your React components
    "./sections/**/*.liquid",      // Shopify section files
    "./snippets/**/*.liquid",      // Shopify snippets
    "./templates/**/*.liquid"      
  ],
  theme: {
    extend: {
      colors: {
        'burgundy': {
          50: '#f9e2e2',
          100: '#f1c6c4',
          200: '#e8a5a6',
          300: '#dc8488',
          400: '#d1634a',
          500: '#c44756',
          600: '#6A2C2E',
          700: '#5a1f21',
          800: '#4a1416',
          900: '#3a0a0c',
        },
        'gold': {
          50: '#fdf7e0',
          100: '#fceeb8',
          200: '#fae38a',
          300: '#f8d948',
          400: '#f6ce00',
          500: '#D9BF77',
          600: '#c4a868',
          700: '#a08c52',
          800: '#7c7040',
          900: '#585430',
        }
      }
    },
  },
  plugins: [],
}

