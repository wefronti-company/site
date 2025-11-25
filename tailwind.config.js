/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#010101',
        'custom-white': '#f7f7f7',
      },
      fontFamily: {
        sans: ['Funnel Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};