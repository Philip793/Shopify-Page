/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", // your React components
    "./sections/**/*.liquid",      // Shopify section files
    "./snippets/**/*.liquid",      // Shopify snippets
    "./templates/**/*.liquid"      
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

