/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lexend Deca"', 'sans-serif'],
      },
      colors: {
        primary: '#22223B', // Deep Indigo
        accent: '#4A4E69',  // Slate Purple
        muted: '#9A8C98',   // Mauve Gray
        highlight: '#C9ADA7', // Rose Dust
        background: '#F2E9E4', // Linen Cream
      },
    },
  },
  plugins: [],
}
