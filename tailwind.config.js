/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.{html,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '576px',
      },
    },
  },
  plugins: [],
};
