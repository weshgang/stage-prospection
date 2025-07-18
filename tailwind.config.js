/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { extend: {keyframes: {
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
    },
    animation: {
      'fade-in': 'fadeIn .5s ease-in-out',
    },} },
  plugins: [],
};