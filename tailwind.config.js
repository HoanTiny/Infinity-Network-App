/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#F8F7FA',
        },
      },
      boxShadow: {
        '3xl': '0px 4px 18px 0px rgba(75, 70, 92, 0.10)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
