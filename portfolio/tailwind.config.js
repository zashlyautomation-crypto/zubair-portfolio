/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#f7931e',
          light: '#ff8c42',
          dark: '#c1272d',
        },
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        vibes: ['Great Vibes', 'cursive'],
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
