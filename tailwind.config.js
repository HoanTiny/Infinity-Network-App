/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#F8F7FA',
        },
        light: {
          100: 'rgba(255, 255, 255, 0.7)',
          200: '#F8F7FA',
          300: '#F1F0F5',
          400: '#EDECF2',
          500: '#E3E1E6',
          600: '#DAD8DE',
          700: '#C9C7CD',
          800: '#B8B6BC',
          900: '#A7A5AB',
        },
      },
      boxShadow: {
        '3xl': '0px 4px 18px 0px rgba(75, 70, 92, 0.10)',
        '4xl': '0px 2px 4px 0px rgba(165, 163, 174, 0.30)',
      },
      fontSize: {
        xxs: '1rem',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
