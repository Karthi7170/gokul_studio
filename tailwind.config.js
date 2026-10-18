/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      colors: { redbrand: '#E8191C', blush: '#FDEEEE', ink: '#111111' },
      fontFamily: { sans: ['Inter', 'Roboto', 'sans-serif'] },
    },
  },
  plugins: [],
};
